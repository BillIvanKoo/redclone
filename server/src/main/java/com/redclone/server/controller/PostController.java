package com.redclone.server.controller;

import com.redclone.server.exception.ResourceNotFoundException;
import com.redclone.server.model.Post;
import com.redclone.server.repository.PostRepository;
import com.redclone.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("posts")
public class PostController{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/users/{userId}")
    public Page<Post> getPostsByUserId(@PathVariable(value = "userId") Long userId, Pageable pageable) {
        return postRepository.findByUserId(userId, pageable);
    }
    
    @PostMapping("/users/{userId}")
    public Post postMethodName(@PathVariable(value = "userId") Long userId, @RequestBody Post post) {
        return userRepository.findById(userId).map(user -> {
            post.setUser(user);
            return postRepository.save(post);
        }).orElseThrow(() -> new ResourceNotFoundException("UserId " + userId + " not found"));
    }
    
}