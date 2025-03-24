package com.mcmanager.mc_manager_backend.model.repository;

import com.mcmanager.mc_manager_backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByUuid(String uuid);

    // 추가: 플레이어 이름으로 검색
    Optional<Player> findByName(String name);

    List<Player> findByIsOnlineTrue();

    // 추가된 메소드
    List<Player> findByUuidIn(List<String> uuids);

    List<Player> findByLastLoginGreaterThanEqual(long since);

    @Query(value = "SELECT DATE(FROM_UNIXTIME(last_login/1000)) as day, " +
            "SUM(LEAST(COALESCE(last_logout, ?2), ?2) - last_login) as play_time " +
            "FROM player_data " +
            "WHERE uuid = ?1 AND last_login >= ?2 " +
            "GROUP BY day ORDER BY day", nativeQuery = true)
    List<Map<String, Object>> getDailyPlayTime(String uuid, long since);
}