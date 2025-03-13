package com.mcmanager.mc_manager_backend.model.repository;

import com.mcmanager.mc_manager_backend.model.ServerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServerStatusRepository extends JpaRepository<ServerStatus, Long> {

    Optional<ServerStatus> findTopByOrderByTimestampDesc();

    @Query("SELECT s FROM ServerStatus s WHERE s.timestamp BETWEEN :startTime AND :endTime AND MOD(s.timestamp, :interval) < 200 ORDER BY s.timestamp")
    List<ServerStatus> findServerStatusHistory(
            @Param("startTime") long startTime,
            @Param("endTime") long endTime,
            @Param("interval") int interval);
}