package com.redclone.server.controller;

import com.redclone.server.exception.ResourceNotFoundException;
import com.redclone.server.model.Post;
import com.redclone.server.model.User;
import com.redclone.server.repository.PostRepository;
import com.redclone.server.repository.UserRepository;
import com.redclone.server.service.JwtUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    @GetMapping("/user/{id}")
    public Page<Post> getPostsByUserId(@PathVariable(value = "id") Long id, Pageable pageable) {
        return postRepository.findByUserId(id, pageable);
    }

    @GetMapping("/parent/{id}")
    public Page<Post> getPostsByParentId(@PathVariable(value = "id") Long id, Pageable pageable) {
        return postRepository.findByParentId(id, pageable);
    }
    
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        User user = userRepository.findByUsername(JwtUserDetailsService.getUsernameFromSecurityContext());
        post.setUser(user);
        return postRepository.save(post);
    }

    @PostMapping("/parent/{id}")
    public Post createComment(@PathVariable(value="id") Long id, @RequestBody Post post) {
        User user = userRepository.findByUsername(JwtUserDetailsService.getUsernameFromSecurityContext());
        return postRepository.findById(id).map(parent -> {
            post.setUser(user);
            post.setParent(parent);
            return postRepository.save(post);
        }).orElseThrow(() -> new ResourceNotFoundException("PostId " + id + " not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable(value="id") Long id, @RequestBody Post postRequest) {
        return postRepository.findById(id).map(post -> {
            if (!post.getUser().getUsername().equals(JwtUserDetailsService.getUsernameFromSecurityContext())){
                return ResponseEntity.badRequest().body("TOKEN USERNAME != TO POST USER");
            }
            post.setContent(postRequest.getContent());
            postRepository.save(post);
            return new ResponseEntity<Post>(post, HttpStatus.OK);
        }).orElseThrow(() -> new ResourceNotFoundException("PostId " + id + " not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable(value = "id") Long id){
        return postRepository.findById(id).map(post -> {
            if (!post.getUser().getUsername().equals(JwtUserDetailsService.getUsernameFromSecurityContext())){
                return ResponseEntity.badRequest().body("TOKEN USERNAME != TO POST USER");
            }
            postRepository.delete(post);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("PostId " + id + " not found"));
    }

}