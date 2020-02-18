import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Card, Typography, Button, message, Popconfirm } from 'antd';
import moment from 'moment';

import CommentTree from 'components/CommentTree';
import { useStore } from 'store';
import AddComment from 'components/AddComment';
import VotePost from 'components/VotePost';
import EditPost from 'components/EditPost';

const { Paragraph, Title } = Typography

export default withRouter(({history}) => {
    const { id } = useParams()
    const [state, dispatch] = useStore();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`)
        .then(res => res.json()).then(data => {
            if (data.message === "No value present") {
                history.push("/")
            }
            setPost(data)
        }).catch(err => {
            console.log(err);
        })
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/parent/${id}`)
        .then(res => res.json()).then(data => {
            setComments(data.content)
        }).catch(err => {
            console.log(err);
        })
    }, [id])

    
    const token = localStorage.getItem("redclone_token")

    const handleDelete = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${post.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            message.info("Post has been deleted!").then(()=>{
                history.push("/")
            })
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <>
        {post.user ? (
            <Card>
                <Paragraph>{post.user.username} {'\u2022'} {moment(post.createdAt).fromNow()}</Paragraph>
                {editing ? (
                    <EditPost post={post}
                        onClickOutside={()=>{setEditing(false)}}
                        onPostUpdate={post=>{setPost(post);setEditing(false)}}
                    />
                ) : (
                    <Title level={3}>{post.content}</Title>
                )}
                <VotePost post={post} updatePost={setPost}/>
                {state.user ? (
                    <>
                    {state.user.username === post.user.username ? (
                        <Button.Group
                            style={{
                                float: "right",
                            }}
                        >
                            <Button icon="edit" onClick={() => {setEditing(true)}}/>
                            <Popconfirm
                                title="Are you sure to delete this post?"
                                placement="bottomRight"
                                onConfirm={handleDelete}
                            >
                                <Button icon="delete"/>
                            </Popconfirm>
                        </Button.Group>
                    ) : null}
                    <AddComment
                        parentId={post.id}
                        onCommentAdded={comment => {
                            setComments([...comments, comment])
                        }}
                    />
                    </>
                ) : null}
            </Card>
        ) : null}
        {comments.map(comment => (
            <CommentTree key={comment.id} comment={comment} />
        ))}
        </>
    )
})