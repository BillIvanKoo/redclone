import React from 'react';
import { Layout } from "antd";
import AccountDropdown from 'components/AccountDropdown';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: "100%" }}>
        <AccountDropdown/>
      </Header>
      <Content>

      </Content>
    </Layout>
  );
}

export default App;
