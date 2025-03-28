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
    private static final int MAX_PACKET_SIZE = 4096;

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
            // 소켓 타임아웃 설정
            socket = new Socket(host, port);
            socket.setSoTimeout(5000); // 5초 타임아웃
            in = socket.getInputStream();
            out = socket.getOutputStream();

            // 인증 패킷 전송
            requestId = (int)(Math.random() * 100000); // 랜덤 요청 ID
            byte[] payload = password.getBytes(StandardCharsets.UTF_8);
            writePacket(PACKET_TYPE_AUTH, requestId, payload);

            // 응답 수신
            RconPacket response = readPacket();

            // ID가 -1이면 인증 실패
            return response.getId() != -1;
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

        try {
            // 명령 패킷 전송
            int cmdId = ++requestId;
            byte[] payload = command.getBytes(StandardCharsets.UTF_8);
            writePacket(PACKET_TYPE_COMMAND, cmdId, payload);

            // 응답 수신
            RconPacket response = readPacket();

            // 응답 ID가 요청 ID와 일치하는지 확인
            if (response.getId() != cmdId) {
                throw new IOException("Received response with mismatched ID");
            }

            return response.getPayload();
        } catch (IOException e) {
            close();
            throw e;
        }
    }

    /**
     * 패킷 작성 및 전송
     */
    private void writePacket(int type, int id, byte[] payload) throws IOException {
        // 패킷 길이 = 페이로드 + 패딩(2) + 타입(4) + ID(4)
        int length = payload.length + 10;

        ByteBuffer packet = ByteBuffer.allocate(length + 4);  // +4는 길이 필드
        packet.order(ByteOrder.LITTLE_ENDIAN);

        packet.putInt(length);        // 패킷 길이 (헤더 제외)
        packet.putInt(id);            // 요청 ID
        packet.putInt(type);          // 패킷 타입
        packet.put(payload);          // 페이로드
        packet.put((byte) 0);         // 종료 패딩
        packet.put((byte) 0);         // 종료 패딩

        out.write(packet.array());
        out.flush();
    }

    /**
     * 패킷 읽기
     */
    private RconPacket readPacket() throws IOException {
        // 길이 필드 읽기 (4바이트)
        byte[] lengthBytes = new byte[4];
        readFully(lengthBytes);

        ByteBuffer lengthBuffer = ByteBuffer.wrap(lengthBytes);
        lengthBuffer.order(ByteOrder.LITTLE_ENDIAN);
        int length = lengthBuffer.getInt();

        if (length < 8 || length > MAX_PACKET_SIZE - 4) {
            throw new IOException("Invalid packet length: " + length);
        }

        // 나머지 패킷 읽기
        byte[] packetBytes = new byte[length];
        readFully(packetBytes);

        ByteBuffer packet = ByteBuffer.wrap(packetBytes);
        packet.order(ByteOrder.LITTLE_ENDIAN);

        int id = packet.getInt();
        int type = packet.getInt();

        // 페이로드 추출 (패딩 2바이트 제외)
        byte[] payloadBytes = new byte[length - 10];
        packet.get(payloadBytes);

        // 패딩 2바이트 건너뛰기
        packet.get();
        packet.get();

        String payload = new String(payloadBytes, StandardCharsets.UTF_8);
        return new RconPacket(id, type, payload);
    }

    /**
     * 스트림에서 정확히 지정된 바이트 수를 읽습니다
     */
    private void readFully(byte[] buffer) throws IOException {
        int bytesRead = 0;
        int remaining = buffer.length;

        while (remaining > 0) {
            int read = in.read(buffer, bytesRead, remaining);
            if (read < 0) {
                throw new IOException("End of stream reached");
            }
            bytesRead += read;
            remaining -= read;
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
        } finally {
            socket = null;
            in = null;
            out = null;
        }
    }

    /**
     * RCON 패킷 클래스
     */
    private static class RconPacket {
        private final int id;
        private final int type;
        private final String payload;

        public RconPacket(int id, int type, String payload) {
            this.id = id;
            this.type = type;
            this.payload = payload;
        }

        public int getId() {
            return id;
        }

        public int getType() {
            return type;
        }

        public String getPayload() {
            return payload;
        }
    }
}