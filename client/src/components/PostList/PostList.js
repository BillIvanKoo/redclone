import React, { useState, useEffect } from 'react';
import PostCard from 'components/PostCard';
import CreatePost from 'components/CreatePost';
import { useStore } from 'store';

export default () => {
    const [state, dispatch] = useStore();
    const [posts, setPosts] = useState([])

    const createPost = post => {
        setPosts([post, ...posts]);
    }
    
    const updatePost = updatedPost => {
        setPosts(posts.map(post => updatedPost.id === post.id ? updatedPost : post))
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts`)
        .then(res => res.json()).then(data => {
            setPosts(data.content.reverse())
        }).catch(err => {
            console.log(err);
        })
    }, [])

    return (
        <div>
            {state.user ? <CreatePost createPost={createPost}/> : <></>}
            {posts.filter(post=>post.parent == null).map(post => (
                <PostCard key={post.id} post={post} updatePost={updatePost}/>
            ))}
        </div>
    )
}