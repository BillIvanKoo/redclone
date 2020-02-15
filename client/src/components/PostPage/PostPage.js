import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';
import moment from 'moment';

import CommentTree from 'components/CommentTree';

const { Paragraph, Title } = Typography

export default () => {
    const { id } = useParams()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`)
        .then(res => res.json()).then(data => {
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

    return (
        <>
        {post.user ? (
            <Card>
                <Paragraph>{post.user.username} {'\u2022'} {moment(post.createdAt).fromNow()}</Paragraph>
                <Title level={3}>{post.content}</Title>
            </Card>
        ) : null}
        {comments.map(comment => (
            <CommentTree comment={comment} />
        ))}
        </>
    )
}