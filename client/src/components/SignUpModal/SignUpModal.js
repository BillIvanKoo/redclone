import React, { useState, useEffect } from "react";
import { Modal, Form, Input } from "antd";

export default ({visible: visibleProps, onClose}) => {
    const [visible, setVisible] = useState(visibleProps);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    useEffect(() => {
        setVisible(visibleProps);
    }, [visibleProps]);
    
    function handleOk() {
        console.log(username);
        console.log(password);
        console.log(onClose)
    }

    return(
        <Modal
            title="Sign Up"
            visible={visible}
            onCancel={()=>{onClose()}}
            onOk={()=>{handleOk()}}
        >
            <Form>
                <Form.Item label="Username">
                    <Input
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password
                        onChange={(e)=>setPassword(e.target.value)}
                    /> 
                </Form.Item>
                <Form.Item label="Confirm Password">
                    <Input.Password /> 
                </Form.Item>
            </Form>
        </Modal>
    );
}