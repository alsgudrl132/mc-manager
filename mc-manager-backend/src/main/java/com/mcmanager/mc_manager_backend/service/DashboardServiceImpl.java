package com.mcmanager.mc_manager_backend.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.mcmanager.mc_manager_backend.rcon.RconClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DashboardServiceImpl implements DashboardService {
    private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);

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

            // 온라인 플레이어가 없고, onlinePlayers > 0인 경우 임시 처리
            if (onlinePlayers.isEmpty() && status.getOnlinePlayers() > 0) {
                List<Player> allPlayers = playerRepo.findAll();
                if (!allPlayers.isEmpty()) {
                    Player player = allPlayers.get(0);
                    player.setOnline(true); // 메모리상에서만 설정
                    status.setPlayers(List.of(player));
                }
            }
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
            logger.error("Player repository is null");
            return new ArrayList<>();
        }

        List<Player> onlinePlayers = playerRepo.findByIsOnlineTrue();
        logger.info("Found {} online players in database", onlinePlayers.size());

        // 벤 목록 조회
        Set<String> bannedPlayerUuids = getBannedPlayerUuids();

        // 각 플레이어에 벤 상태 설정
        for (Player player : onlinePlayers) {
            player.setBanned(bannedPlayerUuids.contains(player.getUuid()));
        }

        // 온라인 플레이어가 없지만 서버에 플레이어가 있다고 보고되면 최근 활동 플레이어를 확인
        if (onlinePlayers.isEmpty()) {
            ServerStatus status = null;
            if (serverStatusRepo != null) {
                status = serverStatusRepo.findTopByOrderByTimestampDesc().orElse(null);
            }

            if (status != null && status.getOnlinePlayers() > 0) {
                logger.info("Server reports {} online players but none found in database", status.getOnlinePlayers());

                // 최근 활동 플레이어를 검색 (예: 10분 이내에 활동한 플레이어)
                long recentCutoff = System.currentTimeMillis() - (10 * 60 * 1000); // 10분
                List<PlayerStatus> recentStatuses = playerStatusRepo.findByTimestampGreaterThan(recentCutoff);

                Set<String> recentUuids = new HashSet<>();
                for (PlayerStatus ps : recentStatuses) {
                    recentUuids.add(ps.getUuid());
                }

                logger.info("Found {} recently active players", recentUuids.size());

                if (!recentUuids.isEmpty()) {
                    List<Player> recentPlayers = playerRepo.findByUuidIn(new ArrayList<>(recentUuids));
                    for (Player p : recentPlayers) {
                        p.setOnline(true); // 메모리에서만 설정
                        p.setBanned(bannedPlayerUuids.contains(p.getUuid())); // 벤 상태도 설정
                    }
                    logger.info("Returning {} players as potentially online", recentPlayers.size());
                    return recentPlayers;
                }
            }
        }

        return onlinePlayers;
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

                // 플레이어 객체에 최신 상태 정보 동기화
                player.setHealth(latestStatus.getHealth());
                player.setLevel(latestStatus.getLevel());
                player.setWorld(latestStatus.getWorld());
                player.setX(latestStatus.getX());
                player.setY(latestStatus.getY());
                player.setZ(latestStatus.getZ());

                // 온라인 상태 확인 및 수정
                long currentTime = System.currentTimeMillis();
                if (currentTime - latestStatus.getTimestamp() < 60000) { // 1분 이내 데이터라면 온라인으로 간주
                    player.setOnline(true);
                }
            }
        }

        // 플레이 시간 통계
        long totalPlayTime = player.getPlayTime();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPlayTimeMs", totalPlayTime);
        stats.put("totalPlayTimeHours", totalPlayTime > 0 ? Math.round(totalPlayTime / 3600000.0 * 10) / 10.0 : 0.0);

        // 최근 일주일 플레이 시간 계산
        if (playerRepo != null) {
            long weekAgo = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000);
            List<Map<String, Object>> originalDailyStats = playerRepo.getDailyPlayTime(uuid, weekAgo);

            // 불변 객체를 새로운 리스트로 복사하고 수정
            List<Map<String, Object>> dailyStats = new ArrayList<>();
            for (Map<String, Object> stat : originalDailyStats) {
                Map<String, Object> newStat = new HashMap<>(stat);
                Object playTime = newStat.get("play_time");
                if (playTime instanceof Number && ((Number) playTime).longValue() < 0) {
                    newStat.put("play_time", 0L);
                }
                dailyStats.add(newStat);
            }

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

        List<ChatLog> chatLogs;

        if (player != null && search != null) {
            chatLogs = chatLogRepo.findByPlayerNameContainingAndMessageContainingOrderByTimestampDesc(
                    player, search, limit);
        } else if (player != null) {
            chatLogs = chatLogRepo.findByPlayerNameContainingOrderByTimestampDesc(player, limit);
        } else if (search != null) {
            chatLogs = chatLogRepo.findByMessageContainingOrderByTimestampDesc(search, limit);
        } else {
            chatLogs = chatLogRepo.findTopNOrderByTimestampDesc(limit);
        }

        // 벤 목록 조회
        Set<String> bannedPlayerUuids = getBannedPlayerUuids();

        // 채팅 로그에 벤 상태 설정
        for (ChatLog chatLog : chatLogs) {
            chatLog.setBanned(bannedPlayerUuids.contains(chatLog.getUuid()));
        }

        return chatLogs;
    }

    // 벤된 플레이어 UUID 목록 조회
    private Set<String> getBannedPlayerUuids() {
        Set<String> bannedUuids = new HashSet<>();

        try {
            // RCON을 통해 벤 목록 가져오기
            String banListResponse = sendRconCommand("banlist");

            // 벤 목록 응답 파싱하기 (예: "There are 3 banned players: player1, player2, player3")
            // 실제 응답 형식에 맞게 조정 필요
            if (banListResponse != null && !banListResponse.contains("There are 0 banned players")) {
                Pattern pattern = Pattern.compile("\\b([\\w]+)\\b");
                Matcher matcher = pattern.matcher(banListResponse);

                while (matcher.find()) {
                    String playerName = matcher.group(1);
                    // 플레이어 이름으로 UUID 찾기
                    if (playerRepo != null) {
                        playerRepo.findByName(playerName).ifPresent(player -> {
                            bannedUuids.add(player.getUuid());
                        });
                    }
                }
            }
        } catch (Exception e) {
            // 오류 발생 시 빈 세트 반환
            return new HashSet<>();
        }

        return bannedUuids;
    }

    @Override
    public CommandResponse executeCommand(String command) {
        try {
            if (command == null || command.isEmpty()) {
                return new CommandResponse(false, "Command cannot be empty");
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
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "kick " + player.getName();
            if (reason != null && !reason.isEmpty()) {
                command += " " + reason;
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
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = value ? "op " + player.getName() : "deop " + player.getName();

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
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "gamemode " + gamemode + " " + player.getName();

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
        RconClient rcon = null;
        try {
            rcon = new RconClient(rconHost, rconPort);
            if (rcon.authenticate(rconPassword)) {
                return rcon.sendCommand(command);
            } else {
                throw new IOException("RCON authentication failed");
            }
        } catch (IOException e) {
            throw new IOException("RCON connection failed: " + e.getMessage(), e);
        } finally {
            if (rcon != null) {
                rcon.close();
            }
        }
    }

    @Override
    public CommandResponse mutePlayer(String uuid, int duration, String unit, String reason) {
        if (playerRepo == null) {
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            // 기본 명령어 구성
            StringBuilder command = new StringBuilder("mute ");
            command.append(player.getName());

            // 기간이 지정된 경우 추가
            if (duration > 0) {
                command.append(" ").append(duration).append(unit);
            }

            // 사유가 지정된 경우 추가
            if (reason != null && !reason.isEmpty()) {
                command.append(" ").append(reason);
            }

            String response = sendRconCommand(command.toString());
            return new CommandResponse(true, "Player " + player.getName() + " has been muted" +
                    (duration > 0 ? " for " + duration + unit : ""));

        } catch (IOException e) {
            return new CommandResponse(false, "Failed to mute player: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse unmutePlayer(String uuid) {
        if (playerRepo == null) {
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "unmute " + player.getName();
            String response = sendRconCommand(command);
            return new CommandResponse(true, "Player " + player.getName() + " has been unmuted");

        } catch (IOException e) {
            return new CommandResponse(false, "Failed to unmute player: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse isMuted(String uuid) {
        if (playerRepo == null) {
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "muted " + player.getName();
            String response = sendRconCommand(command);

            // 응답을 파싱하여 뮤트 상태 확인
            boolean isMuted = !response.contains("not muted") && !response.contains("No player was found");

            if (isMuted) {
                return new CommandResponse(true, "Player " + player.getName() + " is currently muted");
            } else {
                return new CommandResponse(true, "Player " + player.getName() + " is not muted");
            }

        } catch (IOException e) {
            return new CommandResponse(false, "Failed to check mute status: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse banPlayer(String uuid, String reason) {
        if (playerRepo == null) {
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "ban " + player.getName();
            if (reason != null && !reason.isEmpty()) {
                command += " " + reason;
            }

            String response = sendRconCommand(command);
            return new CommandResponse(true, "Player " + player.getName() + " has been banned" +
                    (reason != null && !reason.isEmpty() ? " for: " + reason : ""));
        } catch (IOException e) {
            return new CommandResponse(false, "Failed to ban player: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public CommandResponse unbanPlayer(String uuid) {
        if (playerRepo == null) {
            return new CommandResponse(false, "Player repository not available");
        }

        try {
            Player player = playerRepo.findByUuid(uuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Player not found with UUID: " + uuid));

            String command = "pardon " + player.getName();
            String response = sendRconCommand(command);

            return new CommandResponse(true, "Player " + player.getName() + " has been unbanned");
        } catch (IOException e) {
            return new CommandResponse(false, "Failed to unban player: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return new CommandResponse(false, e.getMessage());
        }
    }

    @Override
    public List<PlayerDetails> getAllOnlinePlayersDetails() {
        List<Player> onlinePlayers = getOnlinePlayers();
        List<PlayerDetails> detailsList = new ArrayList<>();

        for (Player player : onlinePlayers) {
            try {
                PlayerDetails details = getPlayerDetails(player.getUuid());
                detailsList.add(details);
            } catch (Exception e) {
                // 에러 로깅
                logger.error("Error getting details for player " + player.getName() + ": " + e.getMessage());
            }
        }

        return detailsList;
    }
}