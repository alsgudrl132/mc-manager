package com.mcmanager.mc_manager_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MuteRequest {
    private int duration = 0;        // 뮤트 기간 (0이면 영구 뮤트)
    private String unit = "m";       // 기간 단위 (s: 초, m: 분, h: 시간, d: 일)
    private String reason = "";      // 뮤트 사유
}