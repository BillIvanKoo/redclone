import React from 'react';
import { Card, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from "moment";

import VotePost from 'components/VotePost';

const { Title, Paragraph } = Typography

export default withRouter(({post, updatePost, history}) => {

    return (
        <Card>
            <Card.Grid
                hoverable={false}
                style={{
                    width: "10%", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    padding: "24px 0"
                }}
                
            >
                <VotePost post={post} updatePost={updatePost}/>
            </Card.Grid>
            <Card.Grid
                style={{
                    height: "100%",
                    width: "90%",
                    padding: "12px 24px"
                }}
                onClick={()=>{history.push(`/post/${post.id}`)}}
            >
                <Paragraph
                    style={{
                        marginBottom: 0
                    }}
                >Posted by {post.user.username} {'\u2022'} {moment(post.createdAt).fromNow()}</Paragraph>
                <Title level={3}
                    style={{
                        marginTop: 0
                    }}
                >{post.content}</Title>
                <Paragraph>
                    {post.children_count} replies
                </Paragraph>
            </Card.Grid>
        </Card>
    )
})