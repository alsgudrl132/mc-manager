package com.mcmanager.mc_manager_backend.domain;

import lombok.Data;

@Data
public class Player {
    private String name;
    private int level;
    private double health;
    private String world;
    private boolean online;
    private String skinUrl;
}