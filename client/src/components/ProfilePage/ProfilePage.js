import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs } from 'antd'
import PostCard from 'components/PostCard';

const { TabPane } = Tabs;

export default () => {
    const { id } = useParams()
    const [posts, setPosts] = useState([])
    const [votes, setVotes] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/user/${id}`)
        .then(res => res.json()).then(data=>{
            setPosts(data.content)
        }).catch(err => {
            console.log(err)
        })

        fetch(`${process.env.REACT_APP_SERVER_URL}/votes/user/${id}`)
        .then(res => res.json()).then(data=>{
            setVotes(data)
        }).catch(err => {
            console.log(err)
        })
    }, [id])

    const updatePost = updatedPost => {
        setPosts(posts.map(post => updatedPost.id === post.id ? updatedPost : post))
        setVotes(votes.map(vote => vote.post.id === updatedPost.id ? {...vote, post: updatedPost} : vote ));
    }

    return (
        <Tabs>
            <TabPane key={1} tab="Posts">
                {posts.filter(post => !post.parent).map(post=>(
                    <PostCard key={post.id} post={post} updatePost={updatePost}/>
                ))}
            </TabPane>
            <TabPane key={2} tab="Comments">
                {posts.filter(post => post.parent).map(post=>(
                    <PostCard key={post.id} post={post} updatePost={updatePost}/>
                ))}
            </TabPane>
            <TabPane key={3} tab="Voted">
                {votes.map(({post}) => (
                    <PostCard key={post.id} post={post} updatePost={updatePost}/>
                ))}
            </TabPane>
        </Tabs>
    )
}