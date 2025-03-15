package com.mcmanager.mc_manager_backend.service;

import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import com.mcmanager.mc_manager_backend.dto.PlayerDetails;
import com.mcmanager.mc_manager_backend.model.ChatLog;
import com.mcmanager.mc_manager_backend.model.Player;
import com.mcmanager.mc_manager_backend.model.PlayerStatus;
import com.mcmanager.mc_manager_backend.model.ServerStatus;

import java.util.List;

public interface DashboardService {

    ServerStatus getServerStatus();

    List<ServerStatus> getServerHistory(long startTime, long endTime, int interval);

    List<Player> getOnlinePlayers();

    List<Player> getPlayerHistory(long since);

    PlayerDetails getPlayerDetails(String uuid);

    List<PlayerStatus> getPlayerStatusHistory(String uuid, long startTime, long endTime);

    List<ChatLog> getChatLogs(int limit, String player, String search);

    CommandResponse executeCommand(String command);

    CommandResponse kickPlayer(String uuid, String reason);

    CommandResponse opPlayer(String uuid, boolean value);

    CommandResponse setGameMode(String uuid, String gamemode);

    CommandResponse broadcast(String message);

    CommandResponse mutePlayer(String uuid, int duration, String unit, String reason);

    CommandResponse unmutePlayer(String uuid);

    CommandResponse isMuted(String uuid);
}