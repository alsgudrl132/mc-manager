package com.mcmanager.mc_manager_backend.controller;

import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import com.mcmanager.mc_manager_backend.service.ServerManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/server/management")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ServerManagementController {

    @Autowired
    private ServerManagementService serverManagementService;

    @PostMapping("/start")
    public ResponseEntity<CommandResponse> startServer() {
        return ResponseEntity.ok(serverManagementService.startServer());
    }

    @PostMapping("/restart")
    public ResponseEntity<CommandResponse> restartServer() {
        return ResponseEntity.ok(serverManagementService.restartServer());
    }

    @PostMapping("/stop")
    public ResponseEntity<CommandResponse> stopServer() {
        return ResponseEntity.ok(serverManagementService.stopServer());
    }

    @PostMapping("/backup/create")
    public ResponseEntity<CommandResponse> createBackup(
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(serverManagementService.createBackup(reason));
    }

    @GetMapping("/backup/list")
    public ResponseEntity<List<Map<String, Object>>> getBackupList() {
        return ResponseEntity.ok(serverManagementService.getBackupList());
    }

    @GetMapping("/backup/download/{filename}")
    public ResponseEntity<Resource> downloadBackup(@PathVariable String filename) {
        Resource resource = serverManagementService.getBackupResource(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PostMapping("/backup/restore/{filename}")
    public ResponseEntity<CommandResponse> restoreBackup(@PathVariable String filename) {
        return ResponseEntity.ok(serverManagementService.restoreBackup(filename));
    }

    @PostMapping("/weather")
    public ResponseEntity<CommandResponse> setWeather(@RequestParam String weather) {
        return ResponseEntity.ok(serverManagementService.setWeather(weather));
    }

    @PostMapping("/time")
    public ResponseEntity<CommandResponse> setTime(@RequestParam String time) {
        return ResponseEntity.ok(serverManagementService.setTime(time));
    }
}