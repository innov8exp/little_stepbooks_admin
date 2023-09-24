import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Radio,
  Row,
  Skeleton,
} from 'antd'
import { Routes } from '@/libs/router'
import axios from 'axios'
import useQuery from '@/hooks/useQuery'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input

const ChapterForm = () => {
  const query = useQuery()
  const queryId = query.get('id')
  const bookId = query.get('bookId')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)

  const initData = useCallback(() => {
    if (!queryId) {
      axios
        .get(`/api/admin/v1/chapters/max-chapter-number?bookId=${bookId}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({ chapterNumber: res.data + 1 })
          }
        })
      return
    }
    form.setFieldsValue({ content: '加载中...' })
    setLoading(true)
    setIsDisplayForm(true)
    axios.get(`/api/admin/v1/chapters/${queryId}/content`).then((res) => {
      if (res.status === HttpStatus.OK) {
        form.setFieldsValue({ content: res.data })
      }
    })

    axios
      .get(`/api/admin/v1/chapters/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setInitFormData({
            ...resultData,
          })
        }
      })
      .catch((err) => {
        message.error(`操作失败，原因：${err.response?.data?.message}`)
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
  }, [bookId, form, queryId])

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/chapters', {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(Routes.BOOK_LIST.path)
        }
      })
      .catch((err) => {
        message.error(`操作失败，原因：${err.response?.data?.message}`)
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (chapter) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/chapters/${queryId}`, {
        ...chapter,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
        }
      })
      .catch((err) => {
        message.error(`操作失败，原因：${err.response?.data?.message}`)
      })
      .finally(() => setSaveLoading(false))
  }

  const handleSaveAction = () => {
    form
      .validateFields()
      .then((values) => {
        if (queryId) {
          updateData({
            ...values,
            bookId,
          })
        } else {
          createData({
            ...values,
            bookId,
          })
        }
      })
      .catch()
  }

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <Card
      title={
        <>
          <Button
            type='link'
            size='large'
            icon={<LeftCircleOutlined />}
            onClick={() => navigate.goBack()}
          />
          章节编辑
        </>
      }>
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            form={form}
            initialValues={{
              ...initFormData,
            }}>
            <Form.Item name='chapterNumber' label='编号'>
              <Input type='number' readOnly />
            </Form.Item>
            <Form.Item
              name='chapterName'
              label='章节名称'
              rules={[
                {
                  required: true,
                  message: '请输入章节名称',
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              name='needPay'
              label='是否付费'
              rules={[
                {
                  required: true,
                  message: '请输入章节名称',
                },
              ]}>
              <Radio.Group>
                <Radio value>付费</Radio>
                <Radio value={false}>免费</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 16 }}
              name='content'
              label='章节内容'
              rules={[
                {
                  required: true,
                  message: '请输入章节内容',
                },
              ]}>
              <TextArea rows={15} style={{ resize: 'none' }} />
            </Form.Item>
            <div style={{ marginTop: 10 }} />
            <Row justify='end'>
              <Col>
                <Button type='default' onClick={() => form.resetFields()}>
                  重置
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button
                  loading={saveLoading}
                  type='primary'
                  onClick={() => handleSaveAction()}>
                  保存数据
                </Button>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>获取信息失败</span>} />
      )}
    </Card>
  )
}

export default ChapterForm
