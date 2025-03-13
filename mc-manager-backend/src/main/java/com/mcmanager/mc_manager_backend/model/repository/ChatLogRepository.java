package com.mcmanager.mc_manager_backend.model.repository;

import com.mcmanager.mc_manager_backend.model.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {

    @Query(value = "SELECT * FROM chat_log ORDER BY timestamp DESC LIMIT :limit",
            nativeQuery = true)
    List<ChatLog> findTopNOrderByTimestampDesc(@Param("limit") int limit);

    @Query(value = "SELECT * FROM chat_log WHERE player_name LIKE %:player% " +
            "ORDER BY timestamp DESC LIMIT :limit", nativeQuery = true)
    List<ChatLog> findByPlayerNameContainingOrderByTimestampDesc(
            @Param("player") String player, @Param("limit") int limit);

    @Query(value = "SELECT * FROM chat_log WHERE message LIKE %:search% " +
            "ORDER BY timestamp DESC LIMIT :limit", nativeQuery = true)
    List<ChatLog> findByMessageContainingOrderByTimestampDesc(
            @Param("search") String search, @Param("limit") int limit);

    @Query(value = "SELECT * FROM chat_log WHERE player_name LIKE %:player% " +
            "AND message LIKE %:search% ORDER BY timestamp DESC LIMIT :limit",
            nativeQuery = true)
    List<ChatLog> findByPlayerNameContainingAndMessageContainingOrderByTimestampDesc(
            @Param("player") String player, @Param("search") String search,
            @Param("limit") int limit);
}