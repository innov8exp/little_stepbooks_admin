import { Space, Tag } from 'antd'

const EnvFlag = () => {
  let developMode
  const { hostname } = window.location
  if(hostname === 'localhost'){
    developMode = 'LOCAL'
  }else if(hostname.includes('stage')){
    developMode = 'DEV'
  }
  return developMode ? (
    <Space>
      <Tag color="#A30FF2">{developMode}</Tag>
    </Space>
  ) : null
}

export default EnvFlag
