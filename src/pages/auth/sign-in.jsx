import AuthLayout from '@/auth-layout'
import {
  AuthCard,
  CardHeader,
  CustomFormItem,
  LabelText,
  LabelWrapper,
  MainTitle,
  SubTitle,
} from '@/components/auth-styled'
import useSession from '@/hooks/useSession'
import Config from '@/libs/config'
import { Button, Form, Input, message } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SignInPage = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { loading, setLoading, login } = useSession()

  const onFinish = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => login(values))
      .catch(() => message.error(`${t('message.check.checkInputItems')}`))
  }
  return (
    <AuthLayout>
      <AuthCard
        bodyStyle={{ padding: '40px 48px', margin: '0 auto' }}
        bordered={false}
      >
        <CardHeader>
          <MainTitle>{Config.PROJECT_NAME}</MainTitle>
          <SubTitle>{Config.PROJECT_DESCRIPTION}</SubTitle>
        </CardHeader>
        <Form
          layout="vertical"
          requiredMark={false}
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label={<LabelText>{`${t('title.email')}`}</LabelText>}
            rules={[
              {
                required: true,
                message: `${t('message.check.enterEmail')}`,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <CustomFormItem
            name="password"
            label={
              <LabelWrapper>
                <LabelText>{`${t('title.password')}`}</LabelText>
                <Link to="/forget-password">{`${t(
                  'title.forgotPassword',
                )}`}</Link>
              </LabelWrapper>
            }
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
              {`${t('title.login')}`}
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignInPage
