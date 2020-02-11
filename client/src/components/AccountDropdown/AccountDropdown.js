import React, { useState } from 'react';
import { Icon, Dropdown, Button, Menu } from "antd";
import SignUpModal from 'components/SignUpModal';
import LogInModal from 'components/LogInModal';

export default () => {
    const [logInModalVisible, setLogInModalVisible] = useState(false)
    const [signUpModalVisible, setSignUpModalVisible] = useState(false)
    

    function handleMenuClick(e) {
        switch (e.key){
            case "1":
                setLogInModalVisible(true)
                break;
            case "2":
                setSignUpModalVisible(true)
                break;
            default:
                break
        }
    }

    const menu = (
        <Menu onClick={(e)=>{handleMenuClick(e)}}>
            <Menu.Item key={1}>Log In</Menu.Item>
            <Menu.Item key={2}>Sign Up</Menu.Item>
        </Menu>
    )

    return (
        <>
            <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
            >
                <Button
                    style={{
                        position: "absolute",
                        right: "50px",
                        top: "50%",
                        transform: "translate(0, -50%)"
                    }}
                >
                    <Icon type="user" />
                    <Icon type="down" />
                </Button>    
            </Dropdown>
            <LogInModal visible={logInModalVisible} onClose={()=>{setLogInModalVisible(false)}}/>
            <SignUpModal visible={signUpModalVisible} onClose={()=>{setSignUpModalVisible(false)}}/>   
        </>
    )
}