import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useStore } from "store";

export default Form.create({})(({visible: visibleProps, onClose, form}) => {
    const {state, dispatch} = useStore()

    const [visible, setVisible] = useState(visibleProps);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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

            fetch("http://localhost:8080/users/sign-up", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password
                })
            }).then((res)=> {
                return res.json()
            }).then(data => {
                console.log(data)
                onClose()
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
                        <Input
                            onChange={(e)=>setUsername(e.target.value)}
                        />
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
                        <Input.Password
                            onChange={(e)=>setPassword(e.target.value)}
                        />
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