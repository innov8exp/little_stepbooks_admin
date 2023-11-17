import {
  LeftCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Skeleton,
  Upload,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

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

const CourseForm = () => {
  const { t } = useTranslation()
  const params = useParams()
  const bookId = params?.bookId
  const id = params?.id
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const initData = useCallback(() => {
    if (!id) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/courses/${id}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setImageUrl(resultData.coverImg)
          setInitFormData({
            ...resultData,
          })
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
  }, [id, t])

  const createData = (data) => {
    setSaveLoading(true)
    axios
      .post(`/api/admin/v1/books/${bookId}/courses`, {
        ...data,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(-1)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (data) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/courses/${id}`, {
        ...data,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(-1)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const handleSaveAction = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('数字：', values)
        if (id) {
          updateData({
            ...values,
          })
        } else {
          createData({
            ...values,
          })
        }
      })
      .catch()
  }

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
      <div style={{ marginTop: 8 }}>{t('title.coverUpload')}</div>
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
          message.success(`${t('message.tips.uploadSuccess')}`)
        }
      })
      .catch((err) => {
        onError(err)
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(-1)}
          />
          {t('button.courseEditing')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            form={form}
            initialValues={{
              ...initFormData,
            }}
          >
            <Form.Item
              name="name"
              label={t('title.courseName')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.courseName')}`,
                },
              ]}
            >
              <Input
                placeholder={t('message.check.courseName')}
                maxLength={30}
              />
            </Form.Item>
            <Form.Item name="description" label={t('title.courseIntroduction')}>
              <TextArea
                rows={2}
                style={{ resize: 'none' }}
                placeholder={t('message.check.courseIntroduction')}
              />
            </Form.Item>
            <Form.Item
              name="author"
              label={t('title.lecturer')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.lecturer')}`,
                },
              ]}
            >
              <Input placeholder={t('message.check.lecturer')} maxLength={20} />
            </Form.Item>
            <Form.Item
              name="authorIntroduction"
              label={t('title.authorIntroduction')}
            >
              <TextArea
                rows={2}
                style={{ resize: 'none' }}
                placeholder={t('message.check.authorIntroduction')}
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label={t('title.duration')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.duration')}`,
                },
              ]}
            >
              <InputNumber placeholder={t('message.check.duration')} />
            </Form.Item>
            <Form.Item
              name="courseNature"
              label={t('title.courseNature')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.courseNature')}`,
                },
              ]}
            >
              <Radio.Group>
                <Radio value={'NEED_TO_PAY'}>{t('title.NEED_TO_PAY')}</Radio>
                <Radio value={'TRIAL'}>{t('title.TRIAL')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="coverImgId"
              label={t('title.cover')}
              // rules={[
              //   {
              //     required: true,
              //     message: `${t('message.check.uploadCoverImage')}`,
              //   },
              // ]}
            >
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
            <Form.Item
              name="video"
              label={t('title.video')}
              // rules={[
              //   {
              //     required: true,
              //     message: `${t('message.check.uploadVideo')}`,
              //   },
              // ]}
            >
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
                  {t('button.reset')}
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button
                  loading={saveLoading}
                  type="primary"
                  onClick={() => handleSaveAction()}
                >
                  {t('button.saveData')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default CourseForm
