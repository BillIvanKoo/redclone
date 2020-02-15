import React, {useState} from 'react'
import { Comment } from 'antd';
import moment from 'moment';

const CommentTree = ({comment, style: styleProps}) => {
    const [children, setChildren] = useState([])

    const loadComments = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/parent/${comment.id}`)
        .then(res => res.json()).then(data => {
            setChildren(data.content)
        }).catch(err => {
            console.log(err);
        })
    }

    const displayLoad = () => {
        if (children.length > 0) {
            return children.map(child => <CommentTree comment={child} style={{
                borderLeftStyle: "solid",
                margin: "-16px -32px"
            }}/>)
        } else if (comment.children_count > 0) {
            return (
                <Comment
                    actions={[<span onClick={loadComments}>{comment.children_count + " more repl" + (comment.children_count === 1 ? "y" : "ies")}</span>]}
                    style={{
                        borderLeftStyle: "solid",
                        margin: "-16px -32px"
                    }}
                />
            )
        }
        return null
    }

    return (
        <Comment
            style={ styleProps ? styleProps : {
                borderLeftStyle: "solid",
                margin: "0 2.5%"
            }}
            actions={[<span>Reply to</span>]}
            author={comment.user.username}
            datetime={moment(comment.createdAt).fromNow()}
            content={comment.content}
        >
            {displayLoad()}
        </Comment>
    )
}

export default CommentTree;