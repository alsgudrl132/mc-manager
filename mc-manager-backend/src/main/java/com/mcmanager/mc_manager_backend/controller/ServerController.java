package com.mcmanager.mc_manager_backend.controller;

import com.mcmanager.mc_manager_backend.dto.CommandRequest;
import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import com.mcmanager.mc_manager_backend.model.ServerStatus;
import com.mcmanager.mc_manager_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/server")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ServerController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/status")
    public ResponseEntity<ServerStatus> getServerStatus() {
        return ResponseEntity.ok(dashboardService.getServerStatus());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ServerStatus>> getServerHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date to,
            @RequestParam(defaultValue = "60") Integer interval) {

        Date startDate = from != null ? from : new Date(System.currentTimeMillis() - (24 * 60 * 60 * 1000));
        Date endDate = to != null ? to : new Date();

        return ResponseEntity.ok(dashboardService.getServerHistory(startDate.getTime(), endDate.getTime(), interval * 1000));
    }

    @PostMapping("/command")
    public ResponseEntity<CommandResponse> executeCommand(
            @RequestBody CommandRequest command) {

        return ResponseEntity.ok(dashboardService.executeCommand(command.getCommand()));
    }

    @PostMapping("/broadcast")
    public ResponseEntity<CommandResponse> broadcast(
            @RequestBody Map<String, String> request) {

        String message = request.get("message");
        return ResponseEntity.ok(dashboardService.broadcast(message));
    }
}