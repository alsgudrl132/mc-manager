package com.mcmanager.mc_manager_backend.service;

import com.mcmanager.mc_manager_backend.dto.CommandResponse;
import org.springframework.core.io.Resource;

import java.util.List;
import java.util.Map;

public interface ServerManagementService {

    /**
     * 서버를 시작합니다.
     */
    CommandResponse startServer();

    /**
     * 서버를 재시작합니다.
     */
    CommandResponse restartServer();

    /**
     * 서버를 정지합니다.
     */
    CommandResponse stopServer();

    /**
     * 백업을 생성합니다.
     * @param reason 백업 생성 이유 (선택사항)
     */
    CommandResponse createBackup(String reason);

    /**
     * 사용 가능한 백업 목록을 반환합니다.
     */
    List<Map<String, Object>> getBackupList();

    /**
     * 백업 파일의 다운로드 리소스를 반환합니다.
     * @param filename 백업 파일명
     */
    Resource getBackupResource(String filename);

    /**
     * 특정 백업 파일을 복원합니다.
     * @param filename 복원할 백업 파일명
     */
    CommandResponse restoreBackup(String filename);

    /**
     * 서버 날씨를 설정합니다.
     * @param weather 날씨 타입 (clear, rain, storm)
     */
    CommandResponse setWeather(String weather);

    /**
     * 서버 시간을 설정합니다.
     * @param time 시간 설정 (day, night)
     */
    CommandResponse setTime(String time);
}