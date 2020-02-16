import React, { useState, useEffect } from 'react'
import { Comment } from 'antd';
import moment from 'moment';

import { useStore } from 'store';
import AddComment from 'components/AddComment';
import VotePost from 'components/VotePost';

const CommentTree = ({comment: commentProps, style: styleProps}) => {
    const [state, dispacth] = useStore();
    const [comment, setComment] = useState(commentProps);
    const [children, setChildren] = useState([])
    const [showReplyEditor, setShowReplyEditor] = useState(false)

    useEffect(() => {
        setComment(commentProps)
    }, [commentProps])

    const loadComments = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/parent/${comment.id}`)
        .then(res => res.json()).then(data => {
            setChildren(data.content)
        }).catch(err => {
            console.log(err);
        })
    }

    const onCommentAdded = addedComment => {
        if (children.length > 0 || comment.children_count === 0) {
            setChildren([...children, addedComment])
        } else {
            setComment({
                ...comment,
                children_count: comment.children_count + 1
            })
        }
    }

    const handleChildren = () => {
        if (children.length > 0) {
            return children.map(child => <CommentTree comment={child} style={{
                borderLeftStyle: "solid",
                margin: "-16px 0 0 -32px"
            }}/>)
        } else if (comment.children_count > 0) {
            return (
                <Comment
                    actions={[<span onClick={loadComments}>{comment.children_count + " more repl" + (comment.children_count === 1 ? "y" : "ies")}</span>]}
                    style={{
                        borderLeftStyle: "solid",
                        margin: "-16px 0 0 -32px"
                    }}
                />
            )
        }
        return null
    }

    const handleContent = () => {
        return showReplyEditor ? (
            <>
                {comment.content}
                <AddComment
                    onClickOutside={() => {setShowReplyEditor(false)}}
                    parentId={comment.id}
                    onCommentAdded={addedComment => {
                        onCommentAdded(addedComment)
                    }}
                />
            </>
        ) : (
            <>
                {comment.content}
            </>
        )
    }

    const handleActions = () => {
        return showReplyEditor || !state.user ? [
            <div><VotePost post={comment} updatePost={setComment}/></div>,
        ] : [
            <div><VotePost post={comment} updatePost={setComment}/></div>,
            <span onClick={()=>{setShowReplyEditor(true)}}>Reply to</span>
        ]
    }

    return (
        <Comment
            style={ styleProps ? styleProps : {
                borderLeftStyle: "solid",
                margin: "0 2.5%"
            }}
            actions={handleActions()}
            author={comment.user.username}
            datetime={moment(comment.createdAt).fromNow()}
            content={handleContent()}
        >
            {handleChildren()}
        </Comment>
    )
}

export default CommentTree;