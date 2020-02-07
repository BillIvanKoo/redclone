package com.redclone.server.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "votes", "children"})
public class Post extends AuditModel {

    private static final long serialVersionUID = 2629086500513845951L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "post", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude private Set<Vote> votes;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "parent", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude private Set<Post> children;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnoreProperties({"parent"})
    private Post parent;

}