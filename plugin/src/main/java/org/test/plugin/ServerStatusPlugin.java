package org.test.plugin;

import com.destroystokyo.paper.event.server.ServerTickStartEvent;
import org.bukkit.Bukkit;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.*;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ServerStatusPlugin extends JavaPlugin implements Listener {

    private Connection connection;
    private static final int MAX_CHAT_LOG = 100;
    private double tps = 20.0;
    private long startTime;

    // 데이터베이스 설정
    private String host;
    private int port;
    private String database;
    private String username;
    private String password;

    @Override
    public void onEnable() {
        try {
            // 설정 파일 로드
            saveDefaultConfig();
            loadConfig();

            startTime = System.currentTimeMillis();

            // 데이터베이스 연결 설정
            setupDatabase();

            // 이벤트 등록
            getServer().getPluginManager().registerEvents(this, this);

            // 주기적 작업 설정
            Bukkit.getScheduler().runTaskTimerAsynchronously(this, this::updateServerStatus, 20L, 200L);

            getLogger().info("ServerStatusPlugin이 성공적으로 활성화되었습니다.");
        } catch (Exception e) {
            getLogger().severe("플러그인 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            getServer().getPluginManager().disablePlugin(this);
        }
    }

    @Override
    public void onDisable() {
        // 데이터베이스 연결 종료
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                getLogger().info("데이터베이스 연결이 종료되었습니다.");
            }
        } catch (SQLException e) {
            getLogger().severe("데이터베이스 연결 종료 중 오류 발생: " + e.getMessage());
        }
    }

    private void loadConfig() {
        // 설정 파일에서 데이터베이스 정보 로드
        host = getConfig().getString("database.host", "localhost");
        port = getConfig().getInt("database.port", 3306);
        database = getConfig().getString("database.name", "minecraft_dashboard");
        username = getConfig().getString("database.username", "root");
        password = getConfig().getString("database.password", "");
    }

    private void setupDatabase() throws SQLException {
        // 데이터베이스 드라이버 로드
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            getLogger().severe("MySQL 드라이버를 찾을 수 없습니다: " + e.getMessage());
            throw new SQLException("MySQL 드라이버 로딩 실패");
        }

        // 데이터베이스 연결
        String url = "jdbc:mysql://" + host + ":" + port + "/" + database + "?useSSL=false&autoReconnect=true";
        connection = DriverManager.getConnection(url, username, password);

        // 필요한 테이블 생성
        createTables();

        getLogger().info("데이터베이스에 성공적으로 연결되었습니다.");
    }

    private void createTables() throws SQLException {
        // 서버 상태 테이블 생성
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS server_status (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY," +
                    "timestamp BIGINT NOT NULL," +
                    "tps DOUBLE NOT NULL," +
                    "online_players INT NOT NULL," +
                    "max_players INT NOT NULL," +
                    "used_memory INT NOT NULL," +
                    "total_memory INT NOT NULL," +
                    "uptime VARCHAR(50) NOT NULL" +
                    ")");

            // 플레이어 정보 테이블 생성
            stmt.execute("CREATE TABLE IF NOT EXISTS player_data (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY," +
                    "uuid VARCHAR(36) NOT NULL," +
                    "name VARCHAR(16) NOT NULL," +
                    "last_login BIGINT NOT NULL," +
                    "last_logout BIGINT DEFAULT NULL," +
                    "is_online BOOLEAN DEFAULT FALSE," +
                    "play_time BIGINT DEFAULT 0," +
                    "UNIQUE KEY unique_uuid (uuid)" +
                    ")");

            // 플레이어 상태 로그 테이블 생성
            stmt.execute("CREATE TABLE IF NOT EXISTS player_status (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY," +
                    "timestamp BIGINT NOT NULL," +
                    "uuid VARCHAR(36) NOT NULL," +
                    "health DOUBLE NOT NULL," +
                    "level INT NOT NULL," +
                    "world VARCHAR(64) NOT NULL," +
                    "x DOUBLE NOT NULL," +
                    "y DOUBLE NOT NULL," +
                    "z DOUBLE NOT NULL," +
                    "INDEX idx_uuid_timestamp (uuid, timestamp)" +
                    ")");

            // 채팅 로그 테이블 생성
            stmt.execute("CREATE TABLE IF NOT EXISTS chat_log (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY," +
                    "timestamp BIGINT NOT NULL," +
                    "uuid VARCHAR(36) NOT NULL," +
                    "player_name VARCHAR(16) NOT NULL," +
                    "message TEXT NOT NULL," +
                    "INDEX idx_timestamp (timestamp)" +
                    ")");

            getLogger().info("필요한 데이터베이스 테이블이 생성되었습니다.");
        }
    }

    private String getUptime() {
        long uptime = System.currentTimeMillis() - startTime;
        long days = TimeUnit.MILLISECONDS.toDays(uptime);
        long hours = TimeUnit.MILLISECONDS.toHours(uptime) % 24;
        long minutes = TimeUnit.MILLISECONDS.toMinutes(uptime) % 60;
        return String.format("%dd %dh %dm", days, hours, minutes);
    }

    private void updateServerStatus() {
        try {
            long timestamp = System.currentTimeMillis();
            double currentTps = Math.min(20.0, Math.round(tps * 100.0) / 100.0);
            int onlinePlayers = Bukkit.getOnlinePlayers().size();
            int maxPlayers = Bukkit.getMaxPlayers();

            // 시스템 메모리 정보
            Runtime runtime = Runtime.getRuntime();
            int usedMemory = (int)((runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024);
            int maxMemory = (int)(runtime.maxMemory() / 1024 / 1024);
            String uptime = getUptime();

            // 서버 상태 저장
            String sql = "INSERT INTO server_status (timestamp, tps, online_players, max_players, used_memory, total_memory, uptime) VALUES (?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, timestamp);
                pstmt.setDouble(2, currentTps);
                pstmt.setInt(3, onlinePlayers);
                pstmt.setInt(4, maxPlayers);
                pstmt.setInt(5, usedMemory);
                pstmt.setInt(6, maxMemory);
                pstmt.setString(7, uptime);
                pstmt.executeUpdate();
            }

            // 온라인 플레이어 상태 업데이트
            for (Player player : Bukkit.getOnlinePlayers()) {
                updatePlayerStatus(player, timestamp);
            }

            // 오래된 서버 상태 데이터 정리 (30일 이상 된 데이터)
            cleanupOldData();

        } catch (SQLException e) {
            getLogger().warning("서버 상태 업데이트 중 데이터베이스 오류 발생: " + e.getMessage());

            // 연결 재시도
            try {
                if (connection == null || connection.isClosed()) {
                    setupDatabase();
                }
            } catch (SQLException reconnectEx) {
                getLogger().severe("데이터베이스 재연결 실패: " + reconnectEx.getMessage());
            }
        }
    }

    private void updatePlayerStatus(Player player, long timestamp) {
        try {
            String sql = "INSERT INTO player_status (timestamp, uuid, health, level, world, x, y, z) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, timestamp);
                pstmt.setString(2, player.getUniqueId().toString());
                pstmt.setDouble(3, Math.round(player.getHealth() * 10.0) / 10.0);
                pstmt.setInt(4, player.getLevel());
                pstmt.setString(5, player.getWorld().getName());
                pstmt.setDouble(6, player.getLocation().getX());
                pstmt.setDouble(7, player.getLocation().getY());
                pstmt.setDouble(8, player.getLocation().getZ());
                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            getLogger().warning("플레이어 상태 업데이트 중 오류 발생: " + e.getMessage());
        }
    }

    private void cleanupOldData() {
        try {
            long thirtyDaysAgo = System.currentTimeMillis() - (30L * 24L * 60L * 60L * 1000L);

            // 오래된 서버 상태 데이터 삭제
            String sql = "DELETE FROM server_status WHERE timestamp < ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, thirtyDaysAgo);
                int deletedRows = pstmt.executeUpdate();
                if (deletedRows > 0) {
                    getLogger().info("오래된 서버 상태 데이터 " + deletedRows + "개가 정리되었습니다.");
                }
            }

            // 오래된 플레이어 상태 데이터 삭제
            sql = "DELETE FROM player_status WHERE timestamp < ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, thirtyDaysAgo);
                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            getLogger().warning("오래된 데이터 정리 중 오류 발생: " + e.getMessage());
        }
    }

    @EventHandler
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        try {
            String playerName = event.getPlayer().getName();
            String uuid = event.getPlayer().getUniqueId().toString();
            String message = event.getMessage();
            long timestamp = System.currentTimeMillis();

            // 채팅 로그 저장
            String sql = "INSERT INTO chat_log (timestamp, uuid, player_name, message) VALUES (?, ?, ?, ?)";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, timestamp);
                pstmt.setString(2, uuid);
                pstmt.setString(3, playerName);
                pstmt.setString(4, message);
                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            getLogger().warning("채팅 로그 저장 중 오류 발생: " + e.getMessage());
        }
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        try {
            Player player = event.getPlayer();
            String uuid = player.getUniqueId().toString();
            String name = player.getName();
            long joinTime = System.currentTimeMillis();

            // 플레이어 정보 저장/업데이트
            String sql = "INSERT INTO player_data (uuid, name, last_login, is_online) VALUES (?, ?, ?, TRUE) " +
                    "ON DUPLICATE KEY UPDATE name = ?, last_login = ?, is_online = TRUE, last_logout = NULL";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, uuid);
                pstmt.setString(2, name);
                pstmt.setLong(3, joinTime);
                pstmt.setString(4, name);
                pstmt.setLong(5, joinTime);
                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            getLogger().warning("플레이어 접속 정보 저장 중 오류 발생: " + e.getMessage());
        }
    }

    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        try {
            Player player = event.getPlayer();
            String uuid = player.getUniqueId().toString();
            long quitTime = System.currentTimeMillis();

            // 플레이어 정보 업데이트
            String sql = "UPDATE player_data SET is_online = FALSE, last_logout = ?, " +
                    "play_time = play_time + (? - IFNULL(last_login, ?)) " +
                    "WHERE uuid = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, quitTime);
                pstmt.setLong(2, quitTime);
                pstmt.setLong(3, quitTime);
                pstmt.setString(4, uuid);
                pstmt.executeUpdate();
            }
        } catch (SQLException e) {
            getLogger().warning("플레이어 로그아웃 정보 저장 중 오류 발생: " + e.getMessage());
        }
    }

    @EventHandler
    public void onServerTick(ServerTickStartEvent event) {
        // TPS 계산 (1분 평균으로 부드럽게)
        double currentTps = Bukkit.getTPS()[0];
        tps = (tps * 0.9) + (currentTps * 0.1);
    }

    // -------- API 메서드 (외부 플러그인/웹서버에서 사용) --------

    public List<Map<String, Object>> getRecentChatLogs(int limit) {
        List<Map<String, Object>> logs = new ArrayList<>();
        try {
            String sql = "SELECT * FROM chat_log ORDER BY timestamp DESC LIMIT ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setInt(1, limit);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> log = new HashMap<>();
                        log.put("id", rs.getInt("id"));
                        log.put("timestamp", rs.getLong("timestamp"));
                        log.put("uuid", rs.getString("uuid"));
                        log.put("playerName", rs.getString("player_name"));
                        log.put("message", rs.getString("message"));
                        logs.add(log);
                    }
                }
            }
        } catch (SQLException e) {
            getLogger().warning("채팅 로그 조회 중 오류 발생: " + e.getMessage());
        }
        return logs;
    }

    public Map<String, Object> getServerStatus() {
        Map<String, Object> status = new HashMap<>();
        try {
            String sql = "SELECT * FROM server_status ORDER BY timestamp DESC LIMIT 1";
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                if (rs.next()) {
                    status.put("timestamp", rs.getLong("timestamp"));
                    status.put("tps", rs.getDouble("tps"));
                    status.put("onlinePlayers", rs.getInt("online_players"));
                    status.put("maxPlayers", rs.getInt("max_players"));
                    status.put("usedMemory", rs.getInt("used_memory"));
                    status.put("totalMemory", rs.getInt("total_memory"));
                    status.put("uptime", rs.getString("uptime"));
                }
            }

            // 플레이어 목록 추가
            List<Map<String, Object>> players = new ArrayList<>();
            for (Player player : Bukkit.getOnlinePlayers()) {
                Map<String, Object> playerData = new HashMap<>();
                playerData.put("uuid", player.getUniqueId().toString());
                playerData.put("name", player.getName());
                playerData.put("level", player.getLevel());
                playerData.put("health", Math.round(player.getHealth() * 10.0) / 10.0);
                playerData.put("world", player.getWorld().getName());
                playerData.put("x", player.getLocation().getX());
                playerData.put("y", player.getLocation().getY());
                playerData.put("z", player.getLocation().getZ());
                playerData.put("skinUrl", String.format("https://mc-heads.net/avatar/%s", player.getUniqueId().toString()));
                players.add(playerData);
            }
            status.put("players", players);

        } catch (SQLException e) {
            getLogger().warning("서버 상태 조회 중 오류 발생: " + e.getMessage());
        }
        return status;
    }

    public List<Map<String, Object>> getPlayerHistory(String uuid, long startTime, long endTime) {
        List<Map<String, Object>> history = new ArrayList<>();
        try {
            String sql = "SELECT * FROM player_status WHERE uuid = ? AND timestamp BETWEEN ? AND ? ORDER BY timestamp";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setString(1, uuid);
                pstmt.setLong(2, startTime);
                pstmt.setLong(3, endTime);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> statusData = new HashMap<>();
                        statusData.put("timestamp", rs.getLong("timestamp"));
                        statusData.put("health", rs.getDouble("health"));
                        statusData.put("level", rs.getInt("level"));
                        statusData.put("world", rs.getString("world"));
                        statusData.put("x", rs.getDouble("x"));
                        statusData.put("y", rs.getDouble("y"));
                        statusData.put("z", rs.getDouble("z"));
                        history.add(statusData);
                    }
                }
            }
        } catch (SQLException e) {
            getLogger().warning("플레이어 이력 조회 중 오류 발생: " + e.getMessage());
        }
        return history;
    }

    public List<Map<String, Object>> getServerStatusHistory(long startTime, long endTime, int interval) {
        List<Map<String, Object>> history = new ArrayList<>();
        try {
            // 시간 간격으로 데이터 샘플링
            String sql = "SELECT * FROM server_status WHERE timestamp BETWEEN ? AND ? " +
                    "AND (timestamp MOD ?) < 200 ORDER BY timestamp";
            try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
                pstmt.setLong(1, startTime);
                pstmt.setLong(2, endTime);
                pstmt.setInt(3, interval);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        Map<String, Object> statusData = new HashMap<>();
                        statusData.put("timestamp", rs.getLong("timestamp"));
                        statusData.put("tps", rs.getDouble("tps"));
                        statusData.put("onlinePlayers", rs.getInt("online_players"));
                        statusData.put("usedMemory", rs.getInt("used_memory"));
                        statusData.put("totalMemory", rs.getInt("total_memory"));
                        history.add(statusData);
                    }
                }
            }
        } catch (SQLException e) {
            getLogger().warning("서버 상태 이력 조회 중 오류 발생: " + e.getMessage());
        }
        return history;
    }

    // 서버 재시작/정지 기능
    public boolean restartServer() {
        getLogger().info("서버 재시작 명령이 실행됩니다...");
        getServer().dispatchCommand(getServer().getConsoleSender(), "restart");
        return true;
    }

    public boolean stopServer() {
        getLogger().info("서버 정지 명령이 실행됩니다...");
        getServer().dispatchCommand(getServer().getConsoleSender(), "stop");
        return true;
    }

    // 백업 기능
    private File backupFolder;

    private void setupBackupFolder() {
        backupFolder = new File(getDataFolder(), "backups");
        if (!backupFolder.exists()) {
            backupFolder.mkdirs();
        }
    }

    public String createBackup(String reason) {
        try {
            String timestamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
            String backupName = "backup_" + timestamp + ".zip";
            File backupFile = new File(backupFolder, backupName);

            // 서버 저장 명령 실행
            getServer().dispatchCommand(getServer().getConsoleSender(), "save-all");
            Thread.sleep(2000); // 저장 완료를 위한 대기

            // 월드 폴더 압축
            World mainWorld = getServer().getWorlds().get(0);
            File worldFolder = mainWorld.getWorldFolder();

            try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(backupFile))) {
                zipFiles(worldFolder, worldFolder.getName(), zipOut);
            }

            getLogger().info("백업이 생성되었습니다: " + backupName);
            return backupFile.getAbsolutePath();
        } catch (Exception e) {
            getLogger().severe("백업 생성 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private void zipFiles(File folder, String parentFolder, ZipOutputStream zipOut) throws IOException {
        for (File file : folder.listFiles()) {
            if (file.isDirectory()) {
                zipFiles(file, parentFolder + "/" + file.getName(), zipOut);
                continue;
            }

            ZipEntry entry = new ZipEntry(parentFolder + "/" + file.getName());
            zipOut.putNextEntry(entry);

            try (FileInputStream fis = new FileInputStream(file)) {
                byte[] buffer = new byte[1024];
                int length;
                while ((length = fis.read(buffer)) > 0) {
                    zipOut.write(buffer, 0, length);
                }
            }

            zipOut.closeEntry();
        }
    }

    // 날씨 및 시간 설정
    public boolean setWeather(String weather) {
        try {
            switch (weather.toLowerCase()) {
                case "clear":
                    getServer().dispatchCommand(getServer().getConsoleSender(), "weather clear");
                    break;
                case "rain":
                    getServer().dispatchCommand(getServer().getConsoleSender(), "weather rain");
                    break;
                case "storm":
                    getServer().dispatchCommand(getServer().getConsoleSender(), "weather thunder");
                    break;
                default:
                    return false;
            }
            return true;
        } catch (Exception e) {
            getLogger().severe("날씨 설정 중 오류 발생: " + e.getMessage());
            return false;
        }
    }

    public boolean setTime(String time) {
        try {
            switch (time.toLowerCase()) {
                case "day":
                    getServer().dispatchCommand(getServer().getConsoleSender(), "time set day");
                    break;
                case "night":
                    getServer().dispatchCommand(getServer().getConsoleSender(), "time set night");
                    break;
                default:
                    return false;
            }
            return true;
        } catch (Exception e) {
            getLogger().severe("시간 설정 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
}