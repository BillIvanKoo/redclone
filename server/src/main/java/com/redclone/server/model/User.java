package com.redclone.server.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper=false)
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "posts", "votes"})
public class User extends AuditModel {
    private static final long serialVersionUID = -5343371047521510102L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String username;
    
    @JsonIgnore
    private String password;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    private Set<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    private Set<Vote> votes;

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }
}