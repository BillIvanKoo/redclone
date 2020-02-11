package com.redclone.server.controller;

import com.redclone.server.repository.UserRepository;
import com.redclone.server.service.JwtUserDetailsService;
import com.redclone.server.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/sign-up")
    public User signUp(@RequestBody User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @GetMapping("/profile")
    public User getUserProfileFromToken() {
        return userRepository.findByUsername(JwtUserDetailsService.getUsernameFromSecurityContext());
    }
    
}