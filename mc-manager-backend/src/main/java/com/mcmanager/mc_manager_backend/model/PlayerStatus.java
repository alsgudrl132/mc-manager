package com.mcmanager.mc_manager_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "player_status")
public class PlayerStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long timestamp;
    private String uuid;
    private double health;
    private int level;
    private String world;
    private double x;
    private double y;
    private double z;
}