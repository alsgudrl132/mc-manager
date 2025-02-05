package com.mcmanager.mc_manager_backend.domain;

import lombok.Data;

@Data
public class RamUsage {
    private long total;
    private String formatted;
    private long used;
}