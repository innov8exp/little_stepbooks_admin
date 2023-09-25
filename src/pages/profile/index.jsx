import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Upload,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'

const { TextArea } = Input

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const ProfilePage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setUploading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>头像上传</div>
    </div>
  )

  const handleUpload = (options) => {
    // setUploading(true);
    const { onSuccess, onError, file } = options
    const fmData = new FormData()
    fmData.append('file', file)
    axios
      .post(`/api/admin/v1/books/upload`, fmData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          onSuccess()
          form.setFieldsValue({ coverImg: res.data })
          message.success('上传成功!')
        }
      })
      .catch((err) => {
        onError(err)
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Card title="个人信息">
      {
        <Skeleton loading={loading} active>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            form={form}
            initialValues={{}}
          >
            <Form.Item
              name="bookName"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入书名',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="author"
              label="角色"
              rules={[
                {
                  required: true,
                  message: '请输入作者',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="introduction"
              label="个人介绍"
              rules={[
                {
                  required: true,
                  message: '请输入个人介绍',
                },
              ]}
            >
              <TextArea rows={2} style={{ resize: 'none' }} />
            </Form.Item>
            <Form.Item
              name="coverImg"
              label="头像"
              rules={[
                {
                  required: true,
                  message: '请上传封面图片',
                },
              ]}
            >
              <Input hidden />
              <Upload
                name="file"
                listType="picture-card"
                style={{ width: 240, height: 320 }}
                showUploadList={false}
                customRequest={handleUpload}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>

            <div style={{ marginTop: 10 }} />
            <Row justify="end">
              <Col>
                <Button type="default" onClick={() => form.resetFields()}>
                  重置
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button loading={saveLoading} type="primary" onClick={() => {}}>
                  保存修改
                </Button>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      }
    </Card>
  )
}

export default ProfilePage
