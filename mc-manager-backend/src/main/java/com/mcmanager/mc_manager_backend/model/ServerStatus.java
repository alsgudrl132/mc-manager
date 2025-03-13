package com.mcmanager.mc_manager_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "server_status")
public class ServerStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long timestamp;
    private double tps;

    @Column(name = "online_players")
    private int onlinePlayers;

    @Column(name = "max_players")
    private int maxPlayers;

    @Column(name = "used_memory")
    private int usedMemory;

    @Column(name = "total_memory")
    private int totalMemory;

    private String uptime;

    @Transient
    private List<Player> players;
}