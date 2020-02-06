package com.redclone.server.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = false)

@Entity
public class Post extends AuditModel {

    private static final long serialVersionUID = 2629086500513845951L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude private Set<Vote> votes;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude private Set<Post> children;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Post parent;

}