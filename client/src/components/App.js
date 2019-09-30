import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import Navbar from "./Navbar";
import Main from "./Main";
import LoginModal from "../containers/LoginModal";
import JoinModal from "../containers/JoinModal";

const { Header, Content, Footer } = Layout;

const App = () => (
  <BrowserRouter>
    <Layout>
      <Header style={{ paddingRight: "0px", paddingLeft: "5px" }}>
        <Navbar />
      </Header>
      <Content>
        <Row type="flex" justify="space-around" align="middle">
          <Col xs={24} md={22}>
            <LoginModal />
            <JoinModal />
            <Main />
          </Col>
        </Row>
      </Content>
      <Footer style={{ height: "10vh", textAlign: "center" }}>
        Pollster @2019 created by Kyle Kelso
      </Footer>
    </Layout>
  </BrowserRouter>
);

export default App;
