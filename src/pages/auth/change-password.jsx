import md5 from 'js-md5'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import {
  CardHeader,
  CustomFormItem,
  MainTitle,
} from '@/components/auth-styled'
import useSession from '@/hooks/useSession'
import { Button, Form, Input, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { loading, setLoading } = useSession()

  const onFinish = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => {
        const url = `/api/admin/auth/change-password?oldPwd=${md5(values.oldPwd)}&newPwd=${md5(values.newPwd)}`
        axios.post(url).then((res) => {
            if (res && res.status === HttpStatus.OK) {
                message.success(t('changePasswordSuccess'))
                setLoading(false)
                navigate(-1)
            }else{
                message.success(t('changePasswordFail'))
            }
        })
      })
      .catch(() => message.error(`${t('message.check.checkInputItems')}`))
  }
  return (
    <div style={{
        margin: '20px auto 0',
        backgroundColor: '#fff',
        padding: '20px 40px',
        maxWidth: '600px'
    }}>
        <CardHeader>
          <MainTitle>{t('changePassword')}</MainTitle>
        </CardHeader>
        <Form
          layout="vertical"
          requiredMark={false}
          form={form}
          name="changePassword"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="oldPwd"
            label={t('title.password')}
            rules={[
                {
                    required: true,
                    message: `${t('message.check.enterPassword')}`,
                }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <CustomFormItem
            name="newPwd"
            label={t('title.newPassword')}
            rules={[
              {
                required: true,
                message: `${t('message.check.enterPassword')}`,
              },
            ]}
          >
            <Input.Password size="large" />
          </CustomFormItem>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              block
              style={{ borderRadius: '4px', height: '40px' }}
            >
              {`${t('button.determine')}`}
            </Button>
          </Form.Item>
        </Form>
    </div>
  )
}

export default ChangePasswordPage
