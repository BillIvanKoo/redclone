import React, { useState, useRef } from 'react';
import { Card, Input, Button, Form } from 'antd';
import { useOutsideClick } from "hooks";

const { TextArea } = Input;

const cardBodyStyle = {
    padding: "12px"
} 

export default Form.create({})(({ form, createPost }) => {
    const [focus, setFocus] = useState(false);
    const [content, setContent] = useState("");
    const wrapperRef = useRef()

    useOutsideClick(wrapperRef, ()=>{
        setFocus(false)
    })

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                const token = localStorage.getItem("redclone_token")
                fetch(`${process.env.REACT_APP_SERVER_URL}/posts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    },
                    body: JSON.stringify({
                        content: values.content
                    })
                }).then(res => res.json()).then(data=>{
                    createPost(data);
                    form.resetFields();
                    setContent("");
                    setFocus(false)
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }

    return focus ? (
        <div ref={wrapperRef}>
            <Card
                bodyStyle={cardBodyStyle} 
            >
                <Form onSubmit={handleSubmit}>
                    <Form.Item
                        style={{
                            marginBottom: "12px"
                        }}
                    >
                        {form.getFieldDecorator('content', {
                            rules: [{required: true, message: "Content cannot be empty"}]
                        })(
                            <TextArea
                                placeholder="Create Post"
                                autoSize={{minRows: 3}}
                                autoFocus
                                onFocus={() =>{
                                    form.setFieldsValue({"content": content})
                                }}
                                onChange={e =>{setContent(e.target.value)}}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        style={{
                            margin: 0
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    ) : (
        <Card
            bodyStyle={cardBodyStyle}
        >
            
            <Input
                placeholder="Create Post"
                onFocus={()=>{setFocus(true);}}
                value={content}
                onChange={(e)=>{setContent(e.target.value)}}
            />
        </Card>
    )
})