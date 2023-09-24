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
import Config from '@/libs/config'
import { Button, Form, Input, message } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Routes } from '@/libs/router'

const ForgetPasswordPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const forgetPassword = () => {
    message.success('请查看邮件！')
    setLoading(false)
  }

  const onFinish = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => forgetPassword(values))
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
          name="forget password"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <CustomFormItem
            name="email"
            label={
              <LabelWrapper>
                <LabelText>{'邮箱'}</LabelText>
                <Link to={Routes.SIGN_IN.path}>{'返回登录'}</Link>
              </LabelWrapper>
            }
            rules={[
              {
                required: true,
                message: '请输入邮箱',
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
              {'找回密码'}
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ForgetPasswordPage
