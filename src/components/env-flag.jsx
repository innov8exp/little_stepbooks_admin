import {} from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 50px;
  right: -70px;
  width: 300px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: red;
  color: #fff;
  z-index: 100;
  transform: rotate(45deg);
  opacity: 50%;
`

const EnvFlag = () => {
  let developMode = 'LOCAL'
  const { hostname } = window.location
  const domainArr = hostname.split('.')
  if (domainArr.length > 0) {
    const topDomain = domainArr[0]
    switch (topDomain) {
      case 'sat-alb-dev-189482702':
        developMode = 'DEV'
        break
      case 'sat-lb-prod-162190896':
        developMode = 'PROD'
        break
      case 'portal':
        developMode = 'PROD'
        break
      default:
        developMode = 'DEV'
        break
    }
  }
  if (developMode === 'PROD') {
    return null
  }
  return <Container>{developMode}</Container>
}

export default EnvFlag
