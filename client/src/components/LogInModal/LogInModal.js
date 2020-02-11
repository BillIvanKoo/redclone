import React, { useState, useEffect } from 'react';
import { Modal, Form, Icon, Input } from 'antd';

export default ({visible: visibleProps, onClose}) => {
    const [visible, setVisible] = useState(visibleProps);

    useEffect(() => {
        setVisible(visibleProps)
    }, [visibleProps])

    return (
        <Modal
            title="Log In"
            visible={visible}
            onCancel={()=>{onClose()}}
        >
            <Form>
                <Form.Item>
                    <Input
                        prefix={<Icon type="user"/>}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        prefix={<Icon type="lock"/>}
                        type="password"
                        placeholder="Password"
                    /> 
                </Form.Item>
            </Form>

        </Modal>
    )
}