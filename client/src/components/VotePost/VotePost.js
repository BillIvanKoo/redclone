import React, { useState, useEffect } from 'react'
import { Button, Typography } from 'antd'

import { useStore } from "store";

const { Text } = Typography

export default ({post, updatePost: updatePostProps}) => {
    const [state, dispatch] = useStore();
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [voteId, setVoteId] = useState(-1);
    
    useEffect(() => {
        if (state.user && state.user.votes){
            for (const vote of state.user.votes) {
                if (vote.post.id === post.id){
                    setVoteId(vote.id);
                    if (vote.up){
                        setUpvoted(true);
                        setDownvoted(false);
                    } else {
                        setDownvoted(true);
                        setUpvoted(false);
                    }
                    return;
                }
            }
            setUpvoted(false);
            setDownvoted(false);
        } else {
            setUpvoted(false);
            setDownvoted(false);
        }
    }, [state.user])

    const url = process.env.REACT_APP_SERVER_URL

    const updateUserVotes = () => {
        fetch(`${url}/votes/user/${state.user.id}`)
            .then(res => res.json()).then(data=>{
                let user = {...state.user, votes:data}
                dispatch({type: "UPDATE_USER", user})
            }).catch(err=>{
                console.log(err);
            })
    }

    const updatePost = () => {
        fetch(`${url}/posts/${post.id}`)
            .then(res => res.json()).then(data=>{
                updatePostProps(data);
            }).catch(err=>{
                console.log(err);
            })
    }

    const handleVote = (deleteIf, updateIf, up) => {
        const token = localStorage.getItem("redclone_token");
        if (!token) return
        if (deleteIf) {
            fetch(`${url}/votes/${voteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }).then(_=>{
                updateUserVotes()
                updatePost();
            }).catch(err=>{
                console.log(err);
            })
        } else if (updateIf) {
            fetch(`${url}/votes/${voteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({up})
            }).then(_=>{
                updateUserVotes()
                updatePost();
            }).catch(err=>{
                console.log(err);
            })
        } else {
            fetch(`${url}/votes/post/${post.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({up})
            }).then(_=>{
                updateUserVotes()
                updatePost();
            }).catch(err=>{
                console.log(err);
            })
        }
    }

    const handleUpvote = () => {
        handleVote(upvoted, downvoted, true);
    }

    const handleDownvote = () => {
        handleVote(downvoted, upvoted, false);   
    }

    return (
        <>
        <Button
            icon="caret-up"
            type="link"
            style={{
                color: upvoted ? "#1890ff" : "rgba(0, 0, 0, 0.25)"
            }}
            onClick={handleUpvote}
        />
        <Text
            strong
            style={{
                color: upvoted || downvoted ? "#1890ff" : "rgba(0, 0, 0, 0.65)"
            }}
        >
            {post.votes_count}
        </Text>
        <Button
            icon="caret-down"
            type="link"
            style={{
                color: downvoted ? "#1890ff" : "rgba(0, 0, 0, 0.25)"
            }}
            onClick={handleDownvote}
        />
        </>
    )
}