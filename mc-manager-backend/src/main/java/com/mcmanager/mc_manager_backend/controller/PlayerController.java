package com.mcmanager.mc_manager_backend.controller;

import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import com.mcmanager.mc_manager_backend.dto.MuteRequest;
import com.mcmanager.mc_manager_backend.dto.PlayerDetails;
import com.mcmanager.mc_manager_backend.model.Player;
import com.mcmanager.mc_manager_backend.model.PlayerStatus;
import com.mcmanager.mc_manager_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PlayerController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<List<Player>> getOnlinePlayers() {
        return ResponseEntity.ok(dashboardService.getOnlinePlayers());
    }

    @GetMapping("/history")
    public ResponseEntity<List<Player>> getPlayerHistory(
            @RequestParam(defaultValue = "24") Integer hours) {

        long startTime = System.currentTimeMillis() - (hours * 60 * 60 * 1000);
        return ResponseEntity.ok(dashboardService.getPlayerHistory(startTime));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<PlayerDetails> getPlayerDetails(@PathVariable String uuid) {
        return ResponseEntity.ok(dashboardService.getPlayerDetails(uuid));
    }

    @GetMapping("/{uuid}/history")
    public ResponseEntity<List<PlayerStatus>> getPlayerStatusHistory(
            @PathVariable String uuid,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date to) {

        Date startDate = from != null ? from : new Date(System.currentTimeMillis() - (3 * 60 * 60 * 1000));
        Date endDate = to != null ? to : new Date();

        return ResponseEntity.ok(dashboardService.getPlayerStatusHistory(uuid, startDate.getTime(), endDate.getTime()));
    }

    @PostMapping("/{uuid}/kick")
    public ResponseEntity<CommandResponse> kickPlayer(
            @PathVariable String uuid,
            @RequestParam(required = false) String reason) {

        return ResponseEntity.ok(dashboardService.kickPlayer(uuid, reason));
    }

    @PostMapping("/{uuid}/op")
    public ResponseEntity<CommandResponse> opPlayer(
            @PathVariable String uuid,
            @RequestParam boolean value) {

        return ResponseEntity.ok(dashboardService.opPlayer(uuid, value));
    }

    @PostMapping("/{uuid}/gamemode")
    public ResponseEntity<CommandResponse> setGameMode(
            @PathVariable String uuid,
            @RequestParam String gamemode) {

        return ResponseEntity.ok(dashboardService.setGameMode(uuid, gamemode));
    }

    // 새로 추가된 뮤트 관련 엔드포인트
    @PostMapping("/{uuid}/mute")
    public ResponseEntity<CommandResponse> mutePlayer(
            @PathVariable String uuid,
            @RequestBody MuteRequest request) {

        return ResponseEntity.ok(dashboardService.mutePlayer(uuid,
                request.getDuration(),
                request.getUnit(),
                request.getReason()));
    }

    @PostMapping("/{uuid}/unmute")
    public ResponseEntity<CommandResponse> unmutePlayer(
            @PathVariable String uuid) {

        return ResponseEntity.ok(dashboardService.unmutePlayer(uuid));
    }

    @GetMapping("/{uuid}/muted")
    public ResponseEntity<CommandResponse> isMuted(
            @PathVariable String uuid) {

        return ResponseEntity.ok(dashboardService.isMuted(uuid));
    }

    @PostMapping("/{uuid}/ban")
    public ResponseEntity<CommandResponse> banPlayer(
            @PathVariable String uuid,
            @RequestParam(required = false) String reason) {

        return ResponseEntity.ok(dashboardService.banPlayer(uuid, reason));
    }

    @PostMapping("/{uuid}/unban")
    public ResponseEntity<CommandResponse> unbanPlayer(
            @PathVariable String uuid) {

        return ResponseEntity.ok(dashboardService.unbanPlayer(uuid));
    }
}