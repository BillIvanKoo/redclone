import React, { useState, useRef } from 'react';
import { Form, Button, Input, message } from'antd';

import { useOutsideClick } from 'hooks';

const { TextArea } = Input 

export default ({ onClickOutside, parentId, onCommentAdded }) => {
    const editorRef = useRef(null)
    const [content, setContent] = useState("")

    useOutsideClick(editorRef, () => {
        onClickOutside ? onClickOutside() : function(){}();
    })

    const addComment = () => {
        if (content.length > 0) {
            let token = localStorage.getItem("redclone_token")
            fetch(`${process.env.REACT_APP_SERVER_URL}/posts/parent/${parentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    content
                })
            }).then(res => res.json()).then(data => {
                onCommentAdded(data)
                onClickOutside ? onClickOutside() : setContent("")
            }).catch(err => {
                console.log(err);
            })
        } else {
            message.error("Comment cannot be empty!");
        }
    }

    return (
        <div ref={editorRef}>
            <Form.Item
                style={{
                    marginTop: "24px"
                }}
            >
                <TextArea value={content} onChange={e=>{setContent(e.target.value)}}/>
            </Form.Item>
            <Form.Item
                style={{
                    marginBottom: 0
                }}
            >
                <Button onClick={addComment}>
                    Add Comment
                </Button>
            </Form.Item>
        </div>
    )
}