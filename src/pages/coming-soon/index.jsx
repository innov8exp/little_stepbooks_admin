import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ComingSoonPage = () => {
  const { t } = useTranslation()
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('message.error.emptyPage')}
      extra={
        <Button type="primary">
          <Link to={'/'}>{t('message.goIndex')}</Link>
        </Button>
      }
    />
  )
}
export default ComingSoonPage
