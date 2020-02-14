import React, { useState, useEffect } from 'react';
import PostCard from 'components/PostCard';

export default () => {
    const [posts, setPosts] = useState([])

    const updatePost = (updatedPost) => {
        setPosts(posts.map(post => updatedPost.id === post.id ? updatedPost : post))
    }

    useEffect(() => {
        fetch("http://localhost:8080/posts")
        .then(res => res.json()).then(data => {
            setPosts(data.content)
            console.log(data.content)
        }).catch(err => {
            console.log(err);
            
        })
    }, [])
    return (
        <div>
            {posts.filter(post=>post.parent == null).map(post => (
                <PostCard key={post.id} post={post} updatePost={updatePost}/>
            ))}
        </div>
    )
}