package com.mcmanager.mc_manager_backend.controller;

import com.mcmanager.mc_manager_backend.domain.ChatLog;
import com.mcmanager.mc_manager_backend.domain.ServerStatus;
import com.mcmanager.mc_manager_backend.service.MinecraftServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/minecraft")
@RequiredArgsConstructor
public class ServerStatusController {
    private final MinecraftServerService serverService;

    @GetMapping("/status")
    public ServerStatus getServerStatus() {
        return serverService.getCurrentStatus();
    }

    @GetMapping("/chat")
    public List<ChatLog> getChatLogs() {
        return serverService.getRecentChatLogs();
    }
}