import React from 'react';
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import AccountDropdown from 'components/AccountDropdown';
import { StoreProvider } from 'store';
import PostList from 'components/PostList';
import PostPage from 'components/PostPage';
import logo from "assets/images/logo.png";

const { Header, Content } = Layout;

export default () => {
  return (
    <StoreProvider>
      <Router>
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: "100%", padding: "0 5%"}}>
              <Link to="/">
                <img
                  src={logo}
                  style={{
                    maxHeight: "48px",
                    maxWidth: "45%",
                    height: "auto"
                    
                  }}
                />
              </Link>
              <AccountDropdown/>
            </Header>
            <Content style={{marginTop: 64, backgroundColor: "white"}}>
              <Switch>
                <Route exact path="/" component={PostList} />
                <Route path="/post/:id" component={PostPage} />
                <Route path="/profile/:id" />
              </Switch>
            </Content>
        </Layout>
      </Router>
    </StoreProvider>
  );
}