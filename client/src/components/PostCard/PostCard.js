import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from "moment";

import { useStore } from 'store';

const { Title, Text, Paragraph } = Typography

export default withRouter(({post, updatePost: updatePostProps, history}) => {
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

    const handleUpvote = () => {
        const token = localStorage.getItem("redclone_token");
        if (!token) return
        if (upvoted) {
            fetch(`${url}/votes/${voteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }).then(_=>{
                updateUserVotes();
                updatePost();
            }).catch(err=>{
                console.log(err);
            })
        } else if (downvoted) {
            fetch(`${url}/votes/${voteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    up: true
                })
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
                body: JSON.stringify({
                    up: true
                })
            }).then(_=>{
                updateUserVotes()
                updatePost();
            }).catch(err=>{
                console.log(err);
            })
        }
    }

    const handleDownvote = () => {
        const token = localStorage.getItem("redclone_token");
        if (!token) return
        if (downvoted) {
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
        } else if (upvoted) {
            fetch(`${url}/votes/${voteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    up: false
                })
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
                body: JSON.stringify({
                    up: false
                })
            }).then(_=>{
                updateUserVotes()
                updatePost();
            }).catch(err=>{
                console.log(err);
            })
        }   
    }

    return (
        <Card>
            <Card.Grid
                hoverable={false}
                style={{
                    width: "10%", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    padding: "24px 0"
                }}
                
            >
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
            </Card.Grid>
            <Card.Grid
                style={{
                    height: "100%",
                    width: "90%",
                    padding: "12px 24px"
                }}
                onClick={()=>{history.push(`/post/${post.id}`)}}
            >
                <Paragraph
                    style={{
                        marginBottom: 0
                    }}
                >Posted by {post.user.username} {'\u2022'} {moment(post.createdAt).fromNow()}</Paragraph>
                <Title level={3}
                    style={{
                        marginTop: 0
                    }}
                >{post.content}</Title>
                <Paragraph>
                    {post.children_count} replies
                </Paragraph>
            </Card.Grid>
        </Card>
    )
})