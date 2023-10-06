import PropTypes from 'prop-types'
import {} from 'react'
import styled from 'styled-components'
import bgImg from './assets/images/cover-login.jpg'

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${bgImg});
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat;
  background-color: #000000;
`

const Content = styled.div`
  padding-top: 25rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const AuthLayout = ({ children }) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthLayout
