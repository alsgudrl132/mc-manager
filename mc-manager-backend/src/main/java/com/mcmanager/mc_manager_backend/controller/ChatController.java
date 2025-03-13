package com.mcmanager.mc_manager_backend.controller;

import com.mcmanager.mc_manager_backend.model.ChatLog;
import com.mcmanager.mc_manager_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ChatController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/logs")
    public ResponseEntity<List<ChatLog>> getChatLogs(
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(required = false) String player,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(dashboardService.getChatLogs(limit, player, search));
    }
}