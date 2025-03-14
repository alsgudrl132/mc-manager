package com.mcmanager.mc_manager_backend.service;

import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import com.mcmanager.mc_manager_backend.dto.PlayerDetails;
import com.mcmanager.mc_manager_backend.exception.ResourceNotFoundException;
import com.mcmanager.mc_manager_backend.model.ChatLog;
import com.mcmanager.mc_manager_backend.model.Player;
import com.mcmanager.mc_manager_backend.model.PlayerStatus;
import com.mcmanager.mc_manager_backend.model.ServerStatus;
import com.mcmanager.mc_manager_backend.model.repository.ChatLogRepository;
import com.mcmanager.mc_manager_backend.model.repository.PlayerRepository;
import com.mcmanager.mc_manager_backend.model.repository.PlayerStatusRepository;
import com.mcmanager.mc_manager_backend.model.repository.ServerStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ServerStatusRepository serverStatusRepo;
    private final PlayerRepository playerRepo;
    private final PlayerStatusRepository playerStatusRepo;
    private final ChatLogRepository chatLogRepo;

    @Value("${minecraft.rcon.host:localhost}")
    private String rconHost;

    @Value("${minecraft.rcon.port:25575}")
    private int rconPort;

    @Value("${minecraft.rcon.password:password}")
    private String rconPassword;

    @Autowired
    public DashboardServiceImpl(
            @Autowired(required = false) ServerStatusRepository serverStatusRepo,
            @Autowired(required = false) PlayerRepository playerRepo,
            @Autowired(required = false) PlayerStatusRepository playerStatusRepo,
            @Autowired(required = false) ChatLogRepository chatLogRepo) {
        this.serverStatusRepo = serverStatusRepo;
        this.playerRepo = playerRepo;
        this.playerStatusRepo = playerStatusRepo;
        this.chatLogRepo = chatLogRepo;
    }

    @Override
    public ServerStatus getServerStatus() {
        if (serverStatusRepo == null) {
            return new ServerStatus(); // 임시 빈 객체 반환
        }

        ServerStatus status = serverStatusRepo.findTopByOrderByTimestampDesc()
                .orElse(new ServerStatus());

        // 온라인 플레이어 목록 추가
        if (playerRepo != null) {
            List<Player> onlinePlayers = playerRepo.findByIsOnlineTrue();
            status.setPlayers(onlinePlayers);
        }

        return status;
    }

    @Override
    public List<ServerStatus> getServerHistory(long startTime, long endTime, int interval) {
        if (serverStatusRepo == null) {
            return new ArrayList<>();
        }
        return serverStatusRepo.findServerStatusHistory(startTime, endTime, interval);
    }

    @Override
    public List<Player> getOnlinePlayers() {
        if (playerRepo == null) {
            return new ArrayList<>();
        }
        return playerRepo.findByIsOnlineTrue();
    }

    @Override
    public List<Player> getPlayerHistory(long since) {
        if (playerRepo == null) {
            return new ArrayList<>();
        }
        return playerRepo.findByLastLoginGreaterThanEqual(since);
    }

    @Override
    public PlayerDetails getPlayerDetails(String uuid) {
        PlayerDetails details = new PlayerDetails();

        if (playerRepo == null) {
            details.setPlayer(new Player());
            details.setStats(new HashMap<>());
            return details;
        }

        Player player = playerRepo.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

        details.setPlayer(player);

        // 최근 플레이어 상태 정보
        if (playerStatusRepo != null) {
            PlayerStatus latestStatus = playerStatusRepo.findTopByUuidOrderByTimestampDesc(uuid)
                    .orElse(null);

            if (latestStatus != null) {
                details.setCurrentStatus(latestStatus);
            }
        }

        // 플레이 시간 통계
        long totalPlayTime = player.getPlayTime();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPlayTimeMs", totalPlayTime);
        stats.put("totalPlayTimeHours", Math.round(totalPlayTime / 3600000.0 * 10) / 10.0);

        // 최근 일주일 플레이 시간 계산
        if (playerRepo != null) {
            long weekAgo = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000);
            List<Map<String, Object>> dailyStats = playerRepo.getDailyPlayTime(uuid, weekAgo);
            stats.put("dailyPlayTime", dailyStats);
        }

        details.setStats(stats);

        return details;
    }

    @Override
    public List<PlayerStatus> getPlayerStatusHistory(String uuid, long startTime, long endTime) {
        if (playerStatusRepo == null) {
            return new ArrayList<>();
        }
        return playerStatusRepo.findByUuidAndTimestampBetweenOrderByTimestamp(uuid, startTime, endTime);
    }

    @Override
    public List<ChatLog> getChatLogs(int limit, String player, String search) {
        if (chatLogRepo == null) {
            return new ArrayList<>();
        }

        if (player != null && search != null) {
            return chatLogRepo.findByPlayerNameContainingAndMessageContainingOrderByTimestampDesc(
                    player, search, limit);
        } else if (player != null) {
            return chatLogRepo.findByPlayerNameContainingOrderByTimestampDesc(player, limit);
        } else if (search != null) {
            return chatLogRepo.findByMessageContainingOrderByTimestampDesc(search, limit);
        } else {
            return chatLogRepo.findTopNOrderByTimestampDesc(limit);
        }
    }

    @Override
    public CommandResponse executeCommand(String command) {
        try {
            if (command == null || command.isEmpty()) {
                return new CommandResponse(false, "Command cannot be empty");
            }

            // 개발 모드에서는 RCON 없이 응답 시뮬레이션
            if (rconHost == null || rconHost.equals("localhost")) {
                return new CommandResponse(true, "Command executed (simulated): " + command);
            }

            String response = sendRconCommand(command);
            return new CommandResponse(true, response);
        } catch (IOException e) {
            return new CommandResponse(false, "Command execution failed: " + e.getMessage());
        }
    }

    @Override
    public CommandResponse kickPlayer(String uuid, String reason) {
        if (playerRepo == null) {
            return new CommandResponse(true, "Player kicked (simulated)");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "kick " + player.getName();
            if (reason != null && !reason.isEmpty()) {
                command += " " + reason;
            }

            // 개발 모드에서는 RCON 없이 응답 시뮬레이션
            if (rconHost == null || rconHost.equals("localhost")) {
                return new CommandResponse(true, "Player kicked (simulated): " + player.getName());
            }

            String response = sendRconCommand(command);
            return new CommandResponse(true, response);
        } catch (IOException e) {
            return new CommandResponse(false, "Failed to kick player: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse opPlayer(String uuid, boolean value) {
        if (playerRepo == null) {
            return new CommandResponse(true, "Player op status changed (simulated)");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = value ? "op " + player.getName() : "deop " + player.getName();

            // 개발 모드에서는 RCON 없이 응답 시뮬레이션
            if (rconHost == null || rconHost.equals("localhost")) {
                return new CommandResponse(true, "Player " + (value ? "opped" : "deopped") + " (simulated): " + player.getName());
            }

            String response = sendRconCommand(command);
            return new CommandResponse(true, response);
        } catch (IOException e) {
            return new CommandResponse(false, "Failed to change op status: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse setGameMode(String uuid, String gamemode) {
        if (playerRepo == null) {
            return new CommandResponse(true, "Player gamemode changed (simulated)");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "gamemode " + gamemode + " " + player.getName();

            // 개발 모드에서는 RCON 없이 응답 시뮬레이션
            if (rconHost == null || rconHost.equals("localhost")) {
                return new CommandResponse(true, "Player gamemode changed to " + gamemode + " (simulated): " + player.getName());
            }

            String response = sendRconCommand(command);
            return new CommandResponse(true, response);
        } catch (IOException e) {
            return new CommandResponse(false, "Failed to change gamemode: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse broadcast(String message) {
        if (message == null || message.isEmpty()) {
            return new CommandResponse(false, "Broadcast message cannot be empty");
        }

        try {
            String command = "broadcast " + message;

            // 개발 모드에서는 RCON 없이 응답 시뮬레이션
            if (rconHost == null || rconHost.equals("localhost")) {
                return new CommandResponse(true, "Message broadcasted (simulated): " + message);
            }

            String response = sendRconCommand(command);
            return new CommandResponse(true, response);
        } catch (IOException e) {
            return new CommandResponse(false, "Failed to broadcast message: " + e.getMessage());
        }
    }

    /**
     * RCON 프로토콜을 통해 마인크래프트 서버에 명령어 전송
     */
    private String sendRconCommand(String command) throws IOException {
        // 개발 모드에서는 RCON 연결 시뮬레이션
        if (rconHost == null || rconHost.equals("localhost")) {
            return "Command executed (simulated): " + command;
        }

        try (Socket socket = new Socket(rconHost, rconPort)) {
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            // RCON 인증
            out.println("auth " + rconPassword);
            String authResponse = in.readLine();

            if (!"auth successful".equals(authResponse)) {
                throw new IOException("RCON authentication failed");
            }

            // 명령어 전송
            out.println(command);

            // 응답 읽기
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                response.append(line).append("\n");
            }

            return response.toString();
        }
    }
}