package com.mcmanager.mc_manager_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mcmanager.mc_manager_backend.domain.ChatLog;
import com.mcmanager.mc_manager_backend.domain.ServerStatus;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.monitor.FileAlterationListener;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.File;
import java.util.List;

@Slf4j
@Service
public class FileWatcherService {
    private final ObjectMapper objectMapper;
    private final MinecraftServerService serverService;
    private FileAlterationMonitor monitor;
    private final String pluginPath;

    public FileWatcherService(
            ObjectMapper objectMapper,
            MinecraftServerService serverService,
            @Value("${minecraft.plugin.path}") String pluginPath) {
        this.objectMapper = objectMapper;
        this.serverService = serverService;
        this.pluginPath = pluginPath;
        log.info("플러그인 경로 설정됨: {}", pluginPath);
    }

    @PostConstruct
    public void init() throws Exception {
        File directory = new File(pluginPath);
        if (!directory.exists() || !directory.isDirectory()) {
            log.error("플러그인 경로를 찾을 수 없습니다: {}", pluginPath);
            return;
        }

        log.info("파일 감시 시작: {}", pluginPath);
        FileAlterationObserver observer = new FileAlterationObserver(pluginPath);
        monitor = new FileAlterationMonitor(1000);

        observer.addListener(new FileAlterationListener() {
            @Override
            public void onFileChange(File file) {
                log.info("파일 변경 감지: {}", file.getName());
                if (file.getName().equals("server-status.json")) {
                    try {
                        ServerStatus status = objectMapper.readValue(file, ServerStatus.class);
                        serverService.updateServerStatus(status);
                        log.info("서버 상태 업데이트 성공");
                    } catch (Exception e) {
                        log.error("서버 상태 파일 읽기 실패: {}", e.getMessage());
                    }
                } else if (file.getName().equals("chat-log.json")) {
                    try {
                        List<ChatLog> logs = objectMapper.readValue(file,
                                new TypeReference<List<ChatLog>>() {});
                        serverService.updateChatLogs(logs);
                        log.info("채팅 로그 업데이트 성공");
                    } catch (Exception e) {
                        log.error("채팅 로그 파일 읽기 실패: {}", e.getMessage());
                    }
                }
            }

            @Override
            public void onFileCreate(File file) {}

            @Override
            public void onFileDelete(File file) {}

            @Override
            public void onDirectoryChange(File directory) {}

            @Override
            public void onDirectoryCreate(File directory) {}

            @Override
            public void onDirectoryDelete(File directory) {}

            @Override
            public void onStart(FileAlterationObserver observer) {}

            @Override
            public void onStop(FileAlterationObserver observer) {}
        });

        monitor.addObserver(observer);
        monitor.start();
    }

    @PreDestroy
    public void destroy() throws Exception {
        if (monitor != null) {
            monitor.stop();
        }
    }
}