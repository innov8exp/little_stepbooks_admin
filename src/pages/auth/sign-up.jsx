import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Card, Form, Input, message } from 'antd'
import HttpStatus from 'http-status-codes'
import Axios from 'src/common/network'
import { useSession } from 'src/common/session-context'
import AuthLayout from 'src/auth-layout'
import { Routes } from 'src/common/config'

const SignUpLayout = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { login, session } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (session.email) {
      navigate('/')
    }
  }, [navigate, session])

  const getUserInfo = () => {
    Axios.get('/api/admin/auth/user-info')
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const newSession = {
            ...res.data,
            logged_in: true,
            authorities: res.data.permissions,
          }
          login(newSession)
        }
      })
      .catch((err) => message.error(err.message))
  }

  const onFinish = () => {
    setLoading(true)
    form
      .validateFields()
      .then((values) => {
        Axios.post('/api/auth/register', { ...values })
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              getUserInfo()
            }
          })
          .catch((err) => message.error(err.message))
          .finally(() => setLoading(false))
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <AuthLayout>
      <Card
        title='注册'
        bordered={false}
        headStyle={{ width: 350, textAlign: 'center' }}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          name='login'
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item
            name='merchantName'
            label='商家名称'
            rules={[{ required: true, message: '请输入商家名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='邮箱'
            rules={[{ required: true, message: '请输入邮箱地址' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='password'
            label='密码'
            rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='confirm'
            label='确认密码'
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入您的密码',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('两次输入密码不一致，请重新输入!')
                  )
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Button
              style={{ paddingLeft: 50, paddingRight: 50 }}
              type='primary'
              loading={loading}
              htmlType='submit'>
              注册
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Link to={Routes.signIn.path}>已有账号？立即登陆</Link>
          </Form.Item>
        </Form>
      </Card>
    </AuthLayout>
  )
}

export default SignUpLayout
