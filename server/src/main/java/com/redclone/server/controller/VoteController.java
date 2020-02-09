package com.redclone.server.controller;

import java.util.List;

import com.redclone.server.exception.ResourceNotFoundException;
import com.redclone.server.model.User;
import com.redclone.server.model.Vote;
import com.redclone.server.repository.PostRepository;
import com.redclone.server.repository.UserRepository;
import com.redclone.server.repository.VoteRepository;
import com.redclone.server.service.JwtUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("votes")
public class VoteController {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{id}")
    public List<Vote> getVotesByUserId(@PathVariable(value = "id") Long id){
        return voteRepository.findAllByUserId(id);
    }
    
    @GetMapping("/post/{id}")
    public List<Vote> getVotesByPostId(@PathVariable(value = "id") Long id){
        return voteRepository.findAllByPostId(id);
    }

    @PostMapping("/post/{id}")
    public Vote createVote(@PathVariable(value = "id") Long id, @RequestBody Vote vote) {
        User user = userRepository.findByUsername(JwtUserDetailsService.getUsernameFromSecurityContext());
        return postRepository.findById(id).map(post -> {
            vote.setPost(post);
            vote.setUser(user);
            return voteRepository.save(vote);
        }).orElseThrow(() -> new ResourceNotFoundException("PostId " + id + " not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVote(@PathVariable(value = "id") Long id, @RequestBody Vote voteRequest) {
        return voteRepository.findById(id).map(vote -> {
            if (!vote.getUser().getUsername().equals(JwtUserDetailsService.getUsernameFromSecurityContext())){
                return ResponseEntity.badRequest().body("TOKEN USERNAME != TO VOTE USER");
            }
            vote.setUp(voteRequest.isUp());
            voteRepository.save(vote);
            return new ResponseEntity<Vote>(vote, HttpStatus.OK);
        }).orElseThrow(() -> new ResourceNotFoundException("VoteId " + id + " not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVote(@PathVariable(value = "id") Long id){
        return voteRepository.findById(id).map(vote -> {
            if (!vote.getUser().getUsername().equals(JwtUserDetailsService.getUsernameFromSecurityContext())){
                return ResponseEntity.badRequest().body("TOKEN USERNAME != TO VOTE USER");
            }
            voteRepository.delete(vote);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("VoteId " + id + " not found"));
    }
    
}