import React from 'react';
import { Layout } from "antd";
import AccountDropdown from 'components/AccountDropdown';
import { StoreProvider } from 'store';
import PostList from 'components/PostList';

const { Header, Content } = Layout;

export default () => {
  return (
    <StoreProvider>
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: "100%" }}>
          <AccountDropdown/>
        </Header>
        <Content style={{marginTop: 64}}>
          <PostList/>
        </Content>
      </Layout>
    </StoreProvider>
  );
}