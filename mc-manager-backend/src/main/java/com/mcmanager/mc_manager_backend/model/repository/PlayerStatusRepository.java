package com.mcmanager.mc_manager_backend.model.repository;

import com.mcmanager.mc_manager_backend.model.PlayerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerStatusRepository extends JpaRepository<PlayerStatus, Long> {

    Optional<PlayerStatus> findTopByUuidOrderByTimestampDesc(String uuid);

    List<PlayerStatus> findByUuidAndTimestampBetweenOrderByTimestamp(
            String uuid, long startTime, long endTime);

    // 추가된 메소드
    List<PlayerStatus> findByTimestampGreaterThan(long timestamp);
}