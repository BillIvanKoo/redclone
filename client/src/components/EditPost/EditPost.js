import React, { useState, useRef } from 'react'
import { useOutsideClick } from 'hooks';
import { Form, Input, Button, message} from 'antd';

const { TextArea } = Input;

export default ({post, type = "post", onPostUpdate, onClickOutside}) => {
    const [content, setContent] = useState(post.content);
    const ref = useRef(null);
    const token = localStorage.getItem("redclone_token")

    useOutsideClick(ref, () => {
        onClickOutside()
    })

    const handleEditSubmit = () => {
        if (content.length > 0) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${post.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    content
                })
            }).then(res => res.json()).then(data=>{
                onPostUpdate(data);
                setContent(data.content);
            }).catch(err=>{
                console.log(err);
            })
        } else {
            message.error(`${type.charAt(0).toUpperCase()}${type.slice(1)} cannot be empty!`);
        }
    }

    return (
        <div ref={ref}>
            <Form.Item>
                <TextArea value={content} onChange={e => {setContent(e.target.value)}}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={handleEditSubmit}>Submit</Button>
            </Form.Item>
        </div>
    )
}