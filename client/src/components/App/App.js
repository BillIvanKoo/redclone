import React from 'react';
import { Layout } from "antd";
import AccountDropdown from 'components/AccountDropdown';
import { StoreProvider } from 'store';

const { Header, Content } = Layout;

function App() {
  return (
    <StoreProvider>
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: "100%" }}>
          <AccountDropdown/>
        </Header>
        <Content>

        </Content>
      </Layout>
    </StoreProvider>
  );
}

export default App;
