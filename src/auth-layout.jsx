import {} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Config } from "./common/config";
import bgImg from "./assets/images/cover-login.jpg";
import EnvFlag from "./components/env-flag";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${bgImg});
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;
  background-color: #000000;
`;

const Content = styled.div`
  padding-top: 5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 3rem;
`;

const SubTitle = styled.p`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 5rem;
`;

const AuthLayout = ({ children }) => {
  return (
    <Container>
      <Content>
        <Title>{Config.PROJECT_NAME}</Title>
        <SubTitle>{Config.PROJECT_DESCRIPTION}</SubTitle>
        <div>{children}</div>
      </Content>
      <EnvFlag />
    </Container>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
