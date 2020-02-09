package com.redclone.server;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redclone.server.config.JwtToken;
import com.redclone.server.model.Post;
import com.redclone.server.model.User;
import com.redclone.server.model.Vote;
import com.redclone.server.repository.PostRepository;
import com.redclone.server.repository.UserRepository;
import com.redclone.server.repository.VoteRepository;
import com.redclone.server.service.JwtUserDetailsService;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class VoteControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VoteRepository voteRepository;

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUserDetailsService jwtUserDetailsService;

    @Captor
    private ArgumentCaptor<Vote> voteCaptor;

    private static String username = "testUsername";
    private static String token;
    private static Post post;
    private static User user;
    private static Vote vote;

    @Before
    public void init() {
        user = new User();
        user.setId(1L);
        user.setUsername(username);
        user.setPassword("any");
        
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
        new ArrayList<>());
        
        when(jwtUserDetailsService.loadUserByUsername(eq(username))).thenReturn(userDetails);

        JwtToken jwtToken = new JwtToken();
        ReflectionTestUtils.setField(jwtToken, "secret", "secret");
        token = "Bearer " + jwtToken.generateToken(userDetails);

        post = new Post();
        post.setId(1L);
        post.setContent("testContent");

        vote = new Vote();
        vote.setId(1L);
        vote.setUp(true);
    }

    @Test
    public void getVotesByUserIdTest() throws Exception {
        List<Vote> votes = new ArrayList<Vote>();
        when(voteRepository.findAllByUserId(eq(1L))).thenReturn(votes);

        mockMvc.perform(get("/votes/user/1")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());
        
        verify(voteRepository, times(1)).findAllByUserId(eq(1L));
    }

    @Test
    public void getVotesByPostIdTest() throws Exception {
        List<Vote> votes = new ArrayList<Vote>();
        when(voteRepository.findAllByPostId(eq(1L))).thenReturn(votes);

        mockMvc.perform(get("/votes/post/1")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());
        
        verify(voteRepository, times(1)).findAllByPostId(eq(1L));
    }

    @Test
    public void createVoteTest() throws Exception {
        when(userRepository.findByUsername(eq(username))).thenReturn(user);
        when(postRepository.findById(any(Long.class))).thenReturn(Optional.of(post));
        when(voteRepository.save(any(Vote.class))).thenReturn(vote);

        mockMvc.perform(post("/votes/post/1")
            .header("Authorization", token)
            .content(asJsonString(vote))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.up").value(vote.isUp()));
        
        verify(userRepository, times(1)).findByUsername(username);
        verify(voteRepository, times(1)).save(voteCaptor.capture());

        Assert.assertEquals((Long) 1L, voteCaptor.getValue().getUser().getId());
        Assert.assertEquals((Long) 1L, voteCaptor.getValue().getPost().getId());
    }

    @Test
    public void updateVoteTest() throws Exception {
        vote.setUser(user);
        when(voteRepository.findById(eq(1L))).thenReturn(Optional.of(vote));
        
        vote.setUp(false);
        mockMvc.perform(put("/votes/1")
            .header("Authorization", token)
            .content(asJsonString(vote))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.up").value(vote.isUp()));
        
        verify(voteRepository, times(1)).findById(eq(1L));
        verify(voteRepository, times(1)).save(voteCaptor.capture());

        Assert.assertEquals((Long) 1L, voteCaptor.getValue().getId());
        Assert.assertFalse(voteCaptor.getValue().isUp());
    }

    @Test
    public void deleteVoteTest() throws Exception {
        vote.setUser(user);
        when(voteRepository.findById(eq(1L))).thenReturn(Optional.of(vote));

        mockMvc.perform(delete("/votes/1")
            .header("Authorization", token)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());
        
        verify(voteRepository, times(1)).findById(eq(1L));
        verify(voteRepository, times(1)).delete(voteCaptor.capture());

        Assert.assertEquals((Long) 1L, voteCaptor.getValue().getId());
        Assert.assertEquals((Long) 1L, voteCaptor.getValue().getUser().getId());

    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}