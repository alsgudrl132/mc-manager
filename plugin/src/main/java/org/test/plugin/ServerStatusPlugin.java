package org.test.plugin;

import com.destroystokyo.paper.event.server.ServerTickStartEvent;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

public class ServerStatusPlugin extends JavaPlugin implements Listener {

    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private File dataFolder;
    private static final int MAX_CHAT_LOG = 100;
    private Queue<Map<String, Object>> chatLogs = new ConcurrentLinkedQueue<>();
    private double tps = 20.0;

    @Override
    public void onEnable() {
        try {
            dataFolder = getDataFolder();
            Files.createDirectories(dataFolder.toPath());
            getServer().getPluginManager().registerEvents(this, this);
            Bukkit.getScheduler().runTaskTimerAsynchronously(this, this::updateServerStatus, 20L, 200L);
            getLogger().info("ServerStatusPlugin이 성공적으로 활성화되었습니다.");
        } catch (IOException e) {
            getLogger().severe("플러그인 초기화 중 오류 발생: " + e.getMessage());
            getServer().getPluginManager().disablePlugin(this);
        }
    }

    @EventHandler
    public void onServerTick(ServerTickStartEvent event) {
        // TPS 계산을 위한 이벤트 핸들러
        tps = Bukkit.getTPS()[0];
    }

    private void updateServerStatus() {
        try {
            Map<String, Object> serverData = new HashMap<>();

            // 서버 정보
            serverData.put("tps", Math.min(20.0, Math.round(tps * 100.0) / 100.0));
            serverData.put("maxPlayers", Bukkit.getMaxPlayers());
            serverData.put("onlinePlayers", Bukkit.getOnlinePlayers().size());

            // 메모리 사용량
            Runtime runtime = Runtime.getRuntime();
            long usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024;
            long maxMemory = runtime.maxMemory() / 1024 / 1024;
            serverData.put("ramUsage", String.format("%d/%dMB", usedMemory, maxMemory));

            // 플레이어 정보
            List<Map<String, Object>> playerList = new ArrayList<>();
            for (Player player : Bukkit.getOnlinePlayers()) {
                Map<String, Object> playerData = new HashMap<>();
                playerData.put("name", player.getName());
                playerData.put("level", player.getLevel());
                playerData.put("health", Math.round(player.getHealth() * 10.0) / 10.0);
                playerData.put("world", player.getWorld().getName());
                playerList.add(playerData);
            }
            serverData.put("players", playerList);

            saveJson("server-status.json", serverData);
        } catch (Exception e) {
            getLogger().warning("서버 상태 업데이트 중 오류 발생: " + e.getMessage());
        }
    }

    @EventHandler
    public void onPlayerChat(AsyncPlayerChatEvent event) {
        Map<String, Object> chatData = new HashMap<>();
        chatData.put("player", event.getPlayer().getName());
        chatData.put("message", event.getMessage());
        chatData.put("timestamp", System.currentTimeMillis());

        chatLogs.offer(chatData);
        while (chatLogs.size() > MAX_CHAT_LOG) {
            chatLogs.poll();
        }

        Bukkit.getScheduler().runTaskAsynchronously(this, () ->
                saveJson("chat-log.json", new ArrayList<>(chatLogs)));
    }

    private synchronized void saveJson(String fileName, Object data) {
        Path filePath = dataFolder.toPath().resolve(fileName);
        try {
            String json = gson.toJson(data);
            Files.write(filePath, json.getBytes(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            getLogger().warning(fileName + " 저장 중 오류 발생: " + e.getMessage());
        }
    }
}