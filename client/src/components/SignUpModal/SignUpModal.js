import React, { useState, useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useStore } from "store";

export default Form.create({})(({visible: visibleProps, onClose, form}) => {
    const [state, dispatch] = useStore()

    const [visible, setVisible] = useState(visibleProps);
    const [confirmDirty, setConfirmDirty] = useState(false)
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        setVisible(visibleProps);
    }, [visibleProps]);
    
    function handleOk() {
        form.validateFields((err, values)=>{
            if (err) {
                console.log(err);
                return
            }
            setLoading(true)
            const {username, password} = values

            fetch(`${process.env.REACT_APP_SERVER_URL}/users/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password
                })
            }).then(res => res.json()).then(data => {
                let user = data
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
                    dispatch({type: "LOG_IN", user, token})
                    form.resetFields()
                    onClose()
                }).catch(err=>{
                    console.log(err);
                    setLoading(false)
                })
            }).catch(err=>{
                console.log(err);
                setLoading(false)
            })
        })
    }

    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value)
      };

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };
    
    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    return(
        <Modal
            title="Sign Up"
            visible={visible}
            onCancel={()=>{onClose()}}
            onOk={()=>{handleOk()}}
            okButtonProps={{loading}}
        >
            <Form>
                <Form.Item label="Username">
                    {form.getFieldDecorator('username', {
                        rules: [
                            {
                                required: true,
                                message: "Please input your username!"
                            }
                        ]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="Password" hasFeedback>
                    {form.getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: "Please input your password!"
                            },
                            {
                                validator: validateToNextPassword
                            }
                        ]
                    })(
                        <Input.Password />
                    )} 
                </Form.Item>
                <Form.Item label="Confirm Password" hasFeedback>
                    {form.getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: "Please confirm your password!"
                            },
                            {
                                validator: compareToFirstPassword
                            }
                        ]
                    })(
                        <Input.Password onBlur={handleConfirmBlur}/> 
                    )}
                    
                </Form.Item>
            </Form>
        </Modal>
    );
})