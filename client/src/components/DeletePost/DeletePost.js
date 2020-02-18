import React from 'react'
import {Popconfirm, Button} from 'antd'

export default ({callback, postId, placement="bottomRight", type = "post"}) => {

    const token = localStorage.getItem("redclone_token")
    const handleDelete = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            callback(res)
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <Popconfirm
            title={`Are you sure to delete this ${type}?`}
            placement={placement}
            onConfirm={handleDelete}
        >
            <Button icon="delete"/>
        </Popconfirm>
    )
}