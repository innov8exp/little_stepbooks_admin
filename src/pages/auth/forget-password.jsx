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
import { useTranslation } from 'react-i18next'

const ForgetPasswordPage = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const forgetPassword = () => {
    message.success(`${t('message.tips.checkEmail')}`)
    setLoading(false)
  }

  const onFinish = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => forgetPassword(values))
      .catch(() => message.error(`${t('message.check.checkInputItems')}`))
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
                <LabelText>{`${t('title.email')}`}</LabelText>
                <Link to={Routes.SIGN_IN.path}>{`${t(
                  'title.returnLogin',
                )}`}</Link>
              </LabelWrapper>
            }
            rules={[
              {
                required: true,
                message: `${t('message.check.enterEmail')}`,
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
              {`${t('title.retrievePassword')}`}
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ForgetPasswordPage
