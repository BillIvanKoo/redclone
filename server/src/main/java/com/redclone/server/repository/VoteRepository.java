package com.redclone.server.repository;

import java.util.List;

import com.redclone.server.model.Vote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findAllByUserId(Long userId);
    List<Vote> findAllByPostId(Long postId);
}