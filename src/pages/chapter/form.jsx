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
  message,
  Row,
  Skeleton,
  Upload,
} from 'antd'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import UploadComponent from '@/components/upload'

const { TextArea } = Input

const ChapterForm = () => {
  const { t } = useTranslation()
  const params = useParams()
  const queryId = params?.id
  const bookId = params?.bookId
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const { fetchedData } = useFetch(`/api/admin/v1/books/${bookId}`, [])

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

  const initData = useCallback(() => {
    if (!queryId) {
      axios.get(`/api/admin/v1/books/${bookId}/max-chapter-no`).then((res) => {
        if (res.status === HttpStatus.OK) {
          form.setFieldsValue({ chapterNo: res.data + 1 })
        }
      })
      return
    }
    form.setFieldsValue({ content: `${t('message.tips.loading')}` })
    setLoading(true)
    setIsDisplayForm(true)

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
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
  }, [bookId, form, queryId, t])

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post(`/api/admin/v1/books/${bookId}/chapters`, {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
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

  const updateData = (chapter) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/chapters/${queryId}`, {
        ...chapter,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
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
      <div style={{ marginTop: 8 }}>{t('title.imageUpload')}</div>
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
          《{fetchedData?.bookName}》- {t('title.content.create')}
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
              name="chapterNo"
              label={t('title.chapterNo')}
              rules={[
                {
                  required: true,
                  message: `${t('message.placeholder.chapterNo')}`,
                },
              ]}
            >
              <InputNumber placeholder={t('message.placeholder.chapterNo')} />
            </Form.Item>
            <Form.Item name="chapterName" label={t('title.chapterName')}>
              <Input
                placeholder={t('message.placeholder.chapterName')}
                maxLength={50}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 16 }}
              name="description"
              label={t('title.description')}
            >
              <TextArea
                rows={3}
                style={{ resize: 'none' }}
                maxLength={300}
                placeholder={t('message.placeholder.description')}
              />
            </Form.Item>
            <Form.Item
              name="audio"
              label={t('title.audioFrequency')}
              rules={[
                {
                  required: false,
                  message: `${t('message.check.audioFrequency')}`,
                },
              ]}
            >
              <UploadComponent
                name="file"
                showUploadList={false}
                buttonName={t('title.audioFrequencyUpload')}
                fileType={'audio'}
              />
            </Form.Item>
            <Form.Item
              name="image"
              label={t('title.image')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.uploadImage')}`,
                },
              ]}
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
        <Empty description={<span> {t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default ChapterForm
