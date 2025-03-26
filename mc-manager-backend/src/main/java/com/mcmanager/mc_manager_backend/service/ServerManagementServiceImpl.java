package com.mcmanager.mc_manager_backend.service;

import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import com.mcmanager.mc_manager_backend.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ServerManagementServiceImpl implements ServerManagementService {

    private static final Logger logger = LoggerFactory.getLogger(ServerManagementServiceImpl.class);

    @Value("${minecraft.server.directory}")
    private String serverDirectory;

    @Value("${minecraft.server.port:25565}")
    private int minecraftServerPort;

    @Value("${minecraft.server.backups:/path/to/backups}")
    private String backupsPath;

    @Autowired
    private DashboardService dashboardService;

    @Override
    public CommandResponse startServer() {
        try {
            // 서버가 이미 실행 중인지 확인
            boolean isRunning = checkServerRunning();
            if (isRunning) {
                return new CommandResponse(false, "서버가 이미 실행 중입니다.");
            }

            // 서버 시작
            ProcessBuilder processBuilder = new ProcessBuilder("./start.sh");
            processBuilder.directory(new File(serverDirectory)); // 서버 디렉토리 설정
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // 간단히 서버 프로세스 시작 확인
            try {
                Thread.sleep(2000); // 2초 대기
                if (process.isAlive()) {
                    return new CommandResponse(true, "서버 시작이 요청되었습니다.");
                } else {
                    return new CommandResponse(false, "서버 시작 실패: 프로세스가 빠르게 종료됨");
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return new CommandResponse(false, "서버 시작 요청 중 인터럽트 발생");
            }
        } catch (Exception e) {
            logger.error("서버 시작 중 오류 발생", e);
            return new CommandResponse(false, "서버 시작 중 오류 발생: " + e.getMessage());
        }
    }

    // 서버 실행 여부 확인 메서드
    private boolean checkServerRunning() {
        try {
            // 해당 포트에 연결 시도해서 서버가 실행 중인지 확인
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress("localhost", minecraftServerPort), 1000);
            socket.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public CommandResponse restartServer() {
        try {
            return dashboardService.executeCommand("restart");
        } catch (Exception e) {
            logger.error("서버 재시작 중 오류 발생", e);
            return new CommandResponse(false, "서버 재시작 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public CommandResponse stopServer() {
        try {
            return dashboardService.executeCommand("stop");
        } catch (Exception e) {
            logger.error("서버 정지 중 오류 발생", e);
            return new CommandResponse(false, "서버 정지 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public CommandResponse createBackup(String reason) {
        try {
            String command = "backup " + (reason != null ? reason : "");
            CommandResponse response = dashboardService.executeCommand(command);
            return response;
        } catch (Exception e) {
            logger.error("백업 생성 중 오류 발생", e);
            return new CommandResponse(false, "백업 생성 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public List<Map<String, Object>> getBackupList() {
        try {
            Path dir = Paths.get(backupsPath);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }

            return Files.list(dir)
                    .filter(path -> path.toString().endsWith(".zip"))
                    .map(path -> {
                        Map<String, Object> backupInfo = new HashMap<>();
                        backupInfo.put("filename", path.getFileName().toString());
                        try {
                            backupInfo.put("size", Files.size(path));
                            backupInfo.put("creationTime", Files.getLastModifiedTime(path).toMillis());
                        } catch (IOException e) {
                            logger.error("백업 정보 조회 중 오류", e);
                        }
                        return backupInfo;
                    })
                    .sorted(Comparator.<Map<String, Object>, Long>comparing(info ->
                            (Long) info.get("creationTime")).reversed())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            logger.error("백업 목록 조회 중 오류 발생", e);
            return new ArrayList<>();
        }
    }

    @Override
    public Resource getBackupResource(String filename) {
        try {
            Path filePath = Paths.get(backupsPath).resolve(filename);
            if (!Files.exists(filePath)) {
                throw new ResourceNotFoundException("백업 파일이 존재하지 않습니다: " + filename);
            }
            return new FileSystemResource(filePath.toFile());
        } catch (Exception e) {
            logger.error("백업 파일 로드 중 오류 발생", e);
            throw new ResourceNotFoundException("백업 파일 로드 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public CommandResponse restoreBackup(String filename) {
        try {
            String command = "restore " + filename;
            return dashboardService.executeCommand(command);
        } catch (Exception e) {
            logger.error("백업 복원 중 오류 발생", e);
            return new CommandResponse(false, "백업 복원 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public CommandResponse setWeather(String weather) {
        try {
            if (!Arrays.asList("clear", "rain", "storm").contains(weather.toLowerCase())) {
                return new CommandResponse(false, "유효하지 않은 날씨 값: " + weather);
            }

            String command = "weather " + weather.toLowerCase();
            return dashboardService.executeCommand(command);
        } catch (Exception e) {
            logger.error("날씨 설정 중 오류 발생", e);
            return new CommandResponse(false, "날씨 설정 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public CommandResponse setTime(String time) {
        try {
            String command;
            switch (time.toLowerCase()) {
                case "day":
                    command = "time set day";
                    break;
                case "night":
                    command = "time set night";
                    break;
                default:
                    return new CommandResponse(false, "유효하지 않은 시간 값: " + time);
            }

            return dashboardService.executeCommand(command);
        } catch (Exception e) {
            logger.error("시간 설정 중 오류 발생", e);
            return new CommandResponse(false, "시간 설정 중 오류 발생: " + e.getMessage());
        }
    }
}