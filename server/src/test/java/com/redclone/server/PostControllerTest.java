package com.redclone.server;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redclone.server.config.JwtToken;
import com.redclone.server.model.Post;
import com.redclone.server.model.User;
import com.redclone.server.repository.PostRepository;
import com.redclone.server.repository.UserRepository;
import com.redclone.server.service.JwtUserDetailsService;

import org.junit.Before;
import org.junit.Test;
import org.junit.Assert;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
public class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUserDetailsService jwtUserDetailsService;

    @Captor
    private ArgumentCaptor<Post> postCaptor;

    private static String username = "testUsername";
    private static String token;
    private static Post post;
    private static User user;

    @Before
    public void init() {
        user = new User();
        user.setUsername(username);
        user.setPassword("any");
        
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
        new ArrayList<>());
        
        when(jwtUserDetailsService.loadUserByUsername(eq(username))).thenReturn(userDetails);
        when(userRepository.findByUsername(eq(username))).thenReturn(user);

        JwtToken jwtToken = new JwtToken();
        ReflectionTestUtils.setField(jwtToken, "secret", "secret");
        token = "Bearer " + jwtToken.generateToken(userDetails);

        post = new Post();
        post.setContent("testContent");
    }
    
    @Test
    public void getPostsTest() throws Exception {
        Page<Post> posts = new PageImpl<Post>(new ArrayList<>());
        when(postRepository.findAll(any(Pageable.class))).thenReturn(posts);
        
        mockMvc.perform(get("/posts")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());
        
        verify(postRepository, times(1)).findAll(any(Pageable.class));
    }

    @Test
    public void getPostsByUserIdTest() throws Exception {
        Page<Post> posts = new PageImpl<Post>(new ArrayList<>());
        when(postRepository.findByUserId(any(Long.class), any(Pageable.class))).thenReturn(posts);

        mockMvc.perform(get("/posts/user/1")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(postRepository, times(1)).findByUserId(eq(1L), any(Pageable.class));
    }

    @Test
    public void getPostsByParentIdTest() throws Exception {
        Page<Post> posts = new PageImpl<Post>(new ArrayList<>());
        when(postRepository.findByParentId(any(Long.class), any(Pageable.class))).thenReturn(posts);

        mockMvc.perform(get("/posts/parent/1")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());

        verify(postRepository, times(1)).findByParentId(eq(1L), any(Pageable.class));
    }

    @Test
    public void createPostTest() throws Exception {
        when(postRepository.save(any(Post.class))).thenReturn(post);

        mockMvc.perform(post("/posts")
            .header("Authorization", token)
            .content(asJsonString(post))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value(post.getContent()));
        
        verify(userRepository, times(1)).findByUsername(username);
        verify(postRepository, times(1)).save(postCaptor.capture());
        Assert.assertEquals(username, postCaptor.getValue().getUser().getUsername());
    }

    @Test
    public void createCommentTest() throws Exception {
        Post parentPost = new Post();
        parentPost.setId(1L);
        when(postRepository.findById(any(Long.class))).thenReturn(Optional.of(parentPost));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        mockMvc.perform(post("/posts/parent/1")
            .header("Authorization", token)
            .content(asJsonString(post))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value(post.getContent()));
        
        verify(userRepository, times(1)).findByUsername(username);
        verify(postRepository, times(1)).save(postCaptor.capture());
        verify(postRepository, times(1)).findById(eq(1L));

        Assert.assertEquals(username, postCaptor.getValue().getUser().getUsername());
        Assert.assertEquals((Long) 1L, postCaptor.getValue().getParent().getId());
    }    

    @Test
    public void updatePostTest() throws Exception {
        post.setUser(user);
        when(postRepository.findById(any(Long.class))).thenReturn(Optional.of(post));

        post.setContent("testContent+1");
        when(postRepository.save(any(Post.class))).thenReturn(post);

        mockMvc.perform(put("/posts/1")
            .header("Authorization", token)
            .content(asJsonString(post))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value(post.getContent()));
        
        verify(postRepository, times(1)).save(postCaptor.capture());
        verify(postRepository, times(1)).findById(eq(1L));

        Assert.assertEquals(username, postCaptor.getValue().getUser().getUsername());
        Assert.assertEquals("testContent+1", postCaptor.getValue().getContent());
    }
    
    @Test
    public void deletePostTest() throws Exception {
        post.setUser(user);
        when(postRepository.findById(any(Long.class))).thenReturn(Optional.of(post));

        mockMvc.perform(delete("/posts/1")
            .header("Authorization", token)
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk());
        
        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).delete(postCaptor.capture());

        Assert.assertEquals(username, postCaptor.getValue().getUser().getUsername());
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}