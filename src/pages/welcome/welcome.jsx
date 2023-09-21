import styled from 'styled-components'
import { useGlobalStore } from '../../common/global-store'

const Content = styled.h1`
  text-align: center;
  font-size: 20px;
`

const WelcomePage = () => {
  const { projectName } = useGlobalStore()
  return <Content>Welcome to {projectName} Admin System</Content>
}

export default WelcomePage
