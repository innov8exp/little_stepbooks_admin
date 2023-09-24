import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

const ComingSoonPage = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='抱歉，您访问的页面不存在！'
      extra={
        <Button type='primary'>
          <Link to={'/'}>返回主页</Link>
        </Button>
      }
    />
  )
}
export default ComingSoonPage
