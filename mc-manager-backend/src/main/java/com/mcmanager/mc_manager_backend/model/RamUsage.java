package com.mcmanager.mc_manager_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RamUsage {
    private int used;
    private int total;
    private String formatted;
}