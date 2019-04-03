import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Layout, Row, Col } from "antd";
import Main from "./Main";

const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header style={{ height: "10vh" }}>Header</Header>
          <Content>
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={24} md={22}>
                <Main />
              </Col>
            </Row>
          </Content>
          <Footer style={{ height: "10vh", textAlign: "center" }}>
            Footer
          </Footer>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
