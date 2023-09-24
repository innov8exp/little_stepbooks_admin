import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import HttpStatus from 'http-status-codes'
import Config from '@/libs/config'
import AuthLayout from '@/auth-layout'
import {
  AuthCard,
  CardHeader,
  LabelText,
  CustomFormItem,
  LabelWrapper,
  MainTitle,
  SubTitle,
} from '@/components/auth-styled'
import { Link, useNavigate } from 'react-router-dom'
import useUserInfoStore from '@/stores/useUserInfoStore'
import { asyncLogin, asyncUserInfo } from '@/libs/http'

const SignInLayout = () => {
  const [loading, setLoading] = useState(false)
  const { setUserInfo } = useUserInfoStore()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const storeUserInfo = async () => {
    try {
      const resp = await asyncUserInfo
      setUserInfo(resp.data)
      navigate('/')
    } catch (err) {
      if (err.response.status === HttpStatus.UNAUTHORIZED) {
        message.error('获取授权失败，请重新登录！')
      } else {
        message.error('服务器连接异常！')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (values) => {
    try {
      const resp = await asyncLogin(values)
      if (resp.status === HttpStatus.OK) {
        await storeUserInfo()
      }
    } catch (error) {
      if (error.response.status === HttpStatus.UNAUTHORIZED) {
        message.error('邮箱地址或密码错误，请重新输入！')
      } else {
        message.error('服务器连接异常！')
      }
    } finally {
      setLoading(false)
    }
  }

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
        bordered={false}>
        <CardHeader>
          <MainTitle>{Config.PROJECT_NAME}</MainTitle>
          <SubTitle>{Config.PROJECT_DESCRIPTION}</SubTitle>
        </CardHeader>
        <Form
          layout='vertical'
          requiredMark={false}
          form={form}
          name='login'
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item
            name='email'
            label={<LabelText>{'邮箱'}</LabelText>}
            rules={[
              {
                required: true,
                message: '请输入邮箱',
              },
            ]}>
            <Input size='large' />
          </Form.Item>
          <CustomFormItem
            name='password'
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
            ]}>
            <Input.Password size='large' />
          </CustomFormItem>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type='primary'
              loading={loading}
              htmlType='submit'
              block
              style={{ borderRadius: '4px', height: '40px' }}>
              {'登录'}
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  )
}

export default SignInLayout
