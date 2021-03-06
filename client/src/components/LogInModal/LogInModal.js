import React, { useState, useEffect } from 'react';
import { Modal, Form, Icon, Input, message } from 'antd';
import { useStore } from 'store';

export default Form.create({})(({visible: visibleProps, onClose, form}) => {
    const [state, dispatch] = useStore();
    const [visible, setVisible] = useState(visibleProps);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setVisible(visibleProps);
    }, [visibleProps])

    const handleOk = () => {
        form.validateFields((err, values) => {
            if (err) {
                console.log(err);
                return
            }
            setLoading(true)
            const {username, password} = values
            fetch(`${process.env.REACT_APP_SERVER_URL}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password
                })  
            }).then(res => res.json()).then(data => {
                let token = data.token
                if (data.status === 401) {
                    message.error("Wrong username or password!")
                    setLoading(false)
                } else {
                    fetch(`${process.env.REACT_APP_SERVER_URL}/users/profile`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + token
                        }
                    }).then(res => res.json()).then(data => {    
                        let user = data
                        fetch(`${process.env.REACT_APP_SERVER_URL}/votes/user/${user.id}`)
                        .then(res => res.json()).then(data=>{
                            user = {...user, votes:data}
                            dispatch({type: "LOG_IN", user, token})
                            form.resetFields();
                            setLoading(false);
                            onClose();
                        }).catch(err=>{
                            console.log(err);
                            setLoading(false)
                        })
                    }).catch(err=>{
                        console.log(err);
                        setLoading(false)
                    })
                }
            }).catch(err=>{
                console.log(err);
                setLoading(false)
            })
        });
    }

    const { getFieldDecorator } = form;


    return (
        <Modal
            title="Log In"
            visible={visible}
            onCancel={()=>{onClose()}}
            onOk={handleOk}
            okButtonProps={{loading}}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user"/>}
                            placeholder="Username"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            type="password"
                            placeholder="Password"
                        /> 
                    )}
                </Form.Item>
            </Form>

        </Modal>
    )
})