import { Space, Tag } from 'antd'

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
  return (
    <Space>
      <Tag color="#A30FF2">{developMode}</Tag>
    </Space>
  )
}

export default EnvFlag
