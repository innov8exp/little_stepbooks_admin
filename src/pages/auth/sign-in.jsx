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

const SignInLayout = () => {
  const [form] = Form.useForm()
  const { loading, setLoading, login } = useSession()

  const onFinish = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => login(values))
      .catch(() => message.error('请检查输入项！'))
  }

  return (
    <AuthLayout>
      <AuthCard
        bodyStyle={{ padding: '48px', margin: '0 auto' }}
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
            label={<LabelText>{'邮箱'}</LabelText>}
            rules={[
              {
                required: true,
                message: '请输入邮箱',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <CustomFormItem
            name="password"
            label={
              <LabelWrapper>
                <LabelText>{'密码'}</LabelText>
                <Link to={'/sign-up'}>{'忘记密码？'}</Link>
              </LabelWrapper>
            }
            rules={[
              {
                required: true,
                message: '请输入密码',
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
              {'登录'}
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignInLayout
