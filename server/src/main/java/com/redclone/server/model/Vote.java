package com.redclone.server.model;

import javax.persistence.*;

@Entity
public class Vote extends AuditModel {
    private static final long serialVersionUID = -7357976206931826616L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    private boolean up; 
}