package com.mcmanager.mc_manager_backend.rcon;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

/**
 * 마인크래프트 RCON 프로토콜 구현
 * 참고: https://wiki.vg/RCON
 */
public class RconClient {
    private final String host;
    private final int port;
    private Socket socket;
    private InputStream in;
    private OutputStream out;
    private int requestId;

    private static final int PACKET_TYPE_COMMAND = 2;
    private static final int PACKET_TYPE_AUTH = 3;
    private static final int PACKET_ID = 1;  // 요청 ID는 임의의 숫자

    public RconClient(String host, int port) {
        this.host = host;
        this.port = port;
        this.requestId = 0;
    }

    /**
     * RCON 서버에 인증
     */
    public boolean authenticate(String password) throws IOException {
        try {
            socket = new Socket(host, port);
            in = socket.getInputStream();
            out = socket.getOutputStream();

            // 인증 패킷 전송
            byte[] payload = password.getBytes(StandardCharsets.UTF_8);
            sendPacket(PACKET_TYPE_AUTH, payload);

            // 응답 수신
            ByteBuffer response = receivePacket();
            int responseId = response.getInt();
            return responseId != -1;  // 인증 성공 시 요청 ID 반환, 실패 시 -1 반환
        } catch (IOException e) {
            close();
            throw e;
        }
    }

    /**
     * 명령 전송 및 응답 수신
     */
    public String sendCommand(String command) throws IOException {
        if (socket == null || !socket.isConnected()) {
            throw new IOException("Not connected to RCON server");
        }

        // 명령 패킷 전송
        byte[] payload = command.getBytes(StandardCharsets.UTF_8);
        sendPacket(PACKET_TYPE_COMMAND, payload);

        // 응답 수신
        ByteBuffer response = receivePacket();
        byte[] responseData = new byte[response.limit() - 8];  // 헤더 제외
        response.position(8);  // ID와 타입 건너뛰기
        response.get(responseData);

        // 응답은 마지막 2바이트가 패딩(0)
        int length = responseData.length;
        if (length >= 2 && responseData[length - 1] == 0 && responseData[length - 2] == 0) {
            length -= 2;
        }
        return new String(responseData, 0, length, StandardCharsets.UTF_8);
    }

    /**
     * 패킷 전송
     */
    private void sendPacket(int type, byte[] payload) throws IOException {
        // 패킷 길이 = 페이로드 + 패딩(2) + 타입(4) + ID(4)
        int length = payload.length + 10;

        ByteBuffer packet = ByteBuffer.allocate(length + 4);  // +4는 길이 필드
        packet.order(ByteOrder.LITTLE_ENDIAN);

        packet.putInt(length);         // 패킷 길이 (헤더 제외)
        packet.putInt(requestId++);    // 요청 ID
        packet.putInt(type);           // 패킷 타입
        packet.put(payload);           // 페이로드
        packet.put((byte) 0);          // 종료 패딩
        packet.put((byte) 0);          // 종료 패딩

        out.write(packet.array());
        out.flush();
    }

    /**
     * 패킷 수신
     */
    private ByteBuffer receivePacket() throws IOException {
        // 길이 필드 읽기 (4바이트)
        byte[] lengthBytes = new byte[4];
        readFully(lengthBytes);

        ByteBuffer lengthBuffer = ByteBuffer.wrap(lengthBytes);
        lengthBuffer.order(ByteOrder.LITTLE_ENDIAN);
        int length = lengthBuffer.getInt();

        // 나머지 패킷 읽기
        byte[] packetBytes = new byte[length];
        readFully(packetBytes);

        ByteBuffer packet = ByteBuffer.wrap(packetBytes);
        packet.order(ByteOrder.LITTLE_ENDIAN);
        return packet;
    }

    /**
     * 스트림에서 지정된 바이트 수만큼 읽기
     */
    private void readFully(byte[] buffer) throws IOException {
        int bytesRead = 0;
        while (bytesRead < buffer.length) {
            int count = in.read(buffer, bytesRead, buffer.length - bytesRead);
            if (count < 0) {
                throw new IOException("End of stream");
            }
            bytesRead += count;
        }
    }

    /**
     * 연결 종료
     */
    public void close() {
        try {
            if (socket != null) {
                socket.close();
            }
        } catch (IOException e) {
            // 무시
        }
    }
}