package com.mcmanager.mc_manager_backend.service;


import com.mcmanager.mc_manager_backend.domain.ChatLog;
import com.mcmanager.mc_manager_backend.domain.ServerStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
public class MinecraftServerService {
    private ServerStatus currentStatus;
    private final ConcurrentLinkedQueue<ChatLog> chatLogs = new ConcurrentLinkedQueue<>();

    public void updateServerStatus(ServerStatus status) {
        this.currentStatus = status;
        log.info("서버 상태 업데이트: {}", status);
    }

    public void updateChatLogs(List<ChatLog> logs) {
        chatLogs.clear();
        chatLogs.addAll(logs);
        log.info("채팅 로그 업데이트: {} 개의 메시지", logs.size());
    }

    public ServerStatus getCurrentStatus() {
        if (currentStatus == null) {
            return new ServerStatus(); // null인 경우 빈 객체 반환
        }
        return currentStatus;
    }

    public List<ChatLog> getRecentChatLogs() {
        return new ArrayList<>(chatLogs); // 비어있어도 빈 리스트 반환
    }
}