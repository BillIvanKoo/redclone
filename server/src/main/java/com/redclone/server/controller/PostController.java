package com.redclone.server.controller;

import com.redclone.server.exception.ResourceNotFoundException;
import com.redclone.server.model.Post;
import com.redclone.server.model.User;
import com.redclone.server.repository.PostRepository;
import com.redclone.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    
    @PostMapping("/")
    public Post createPost(@RequestBody Post post) {
        User user = userRepository.findByUsername(getUsernameFromToken());
        post.setUser(user);
        return postRepository.save(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable(value="id") Long id, @RequestBody Post postRequest) {
        return postRepository.findById(id).map(post -> {
            if (!post.getUser().getUsername().equals(getUsernameFromToken())){
                return ResponseEntity.badRequest().body("TOKEN USERNAME != TO POST USER");
            }
            post.setContent(postRequest.getContent());
            postRepository.save(post);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("PostId " + id + " not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable(value = "id") Long id){
        return postRepository.findById(id).map(post -> {
            if (!post.getUser().getUsername().equals(getUsernameFromToken())){
                return ResponseEntity.badRequest().body("TOKEN USERNAME != TO POST USER");
            }
            postRepository.delete(post);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("PostId " + id + " not found"));
    }
    
    private String getUsernameFromToken(){
        UserDetails userDetails = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

}