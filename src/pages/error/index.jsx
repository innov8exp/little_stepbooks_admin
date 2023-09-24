import styled from 'styled-components'

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-top: 5rem;
  text-align: center;
`

const Error = (code, message) => {
  return (
    <Content>
      <h1>{code}</h1>
      <h3>{message}</h3>
    </Content>
  )
}

export default Error
