import React, { useState, useEffect } from 'react';
import { Icon, Dropdown, Button, Menu } from "antd";
import { withRouter } from 'react-router-dom';

import SignUpModal from 'components/SignUpModal';
import LogInModal from 'components/LogInModal';
import { useStore } from 'store';

export default withRouter(({ history }) => {
    const [state, dispatch] = useStore();
    const [logInModalVisible, setLogInModalVisible] = useState(false)
    const [signUpModalVisible, setSignUpModalVisible] = useState(false)
    

    useEffect(() => {
        let token = localStorage.getItem("redclone_token")
        if (token) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/users/profile`, {
                method: "GET",
                headers: {
                "Content-Type": 'application/json',
                "Authorization": "Bearer " + token
                }
            }).then(res=>{
                if (res.status === 401 || res.status === 500){
                    dispatch({
                        type: "LOG_OUT"
                    });
                    return
                }
                return res.json()
            }).then(data => {
                if (data){
                    let user = data
                    fetch(`${process.env.REACT_APP_SERVER_URL}/votes/user/${user.id}`)
                    .then(res => res.json()).then(data=>{
                        user = {...user, votes:data}
                        dispatch({type: "LOG_IN", user, token})
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, [])

    function handleMenuClick(e) {
        switch (e.key){
            case "login":
                setLogInModalVisible(true)
                break;
            case "signup":
                setSignUpModalVisible(true)
                break;
            case "profile":
                history.push(`/profile/${state.user.id}`)
                break;
            case "logout":
                dispatch({
                    type: "LOG_OUT"
                });
                break;
            default:
                break;
        }
    }

    const loggedOutMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key={'login'}>Log In</Menu.Item>
            <Menu.Item key={'signup'}>Sign Up</Menu.Item>
        </Menu>
    )

    const loggedInMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key={"profile"}>My Profile</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key={"logout"}>Log Out</Menu.Item>
        </Menu>
    )

    return (
        <>
            <Dropdown
                overlay={state.user !== null ? loggedInMenu : loggedOutMenu}
                trigger={['click']}
                placement="bottomRight"
            >
                <Button
                    style={{
                        position: "absolute",
                        right: "5%",
                        top: "50%",
                        transform: "translate(0, -50%)"
                    }}
                >
                    <Icon type="user" />
                    {state.user !== null ? "Welcome " + state.user.username + "!" : null}
                    <Icon type="down" />
                </Button>    
            </Dropdown>
            <LogInModal visible={logInModalVisible} onClose={()=>{setLogInModalVisible(false)}}/>
            <SignUpModal visible={signUpModalVisible} onClose={()=>{setSignUpModalVisible(false)}}/>   
        </>
    )
})