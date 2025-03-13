package com.mcmanager.mc_manager_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "player_data")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String uuid;

    private String name;
    private long lastLogin;
    private Long lastLogout;
    private boolean isOnline;
    private long playTime;

    @Transient
    private double health;

    @Transient
    private int level;

    @Transient
    private String world;

    @Transient
    private Double x;

    @Transient
    private Double y;

    @Transient
    private Double z;

    @Transient
    private String skinUrl;
}