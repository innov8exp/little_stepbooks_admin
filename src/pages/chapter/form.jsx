import UploadComp from '@/components/upload'
import useFetch from '@/hooks/useFetch'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Skeleton,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

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

  const { fetchedData } = useFetch(`/api/admin/v1/books/${bookId}`, [])

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
            img: resultData.imgId,
            audio: resultData.audioId,
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
            <Form.Item name="imgId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="imgUrl" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="audioId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="audioUrl" hidden>
              <Input />
            </Form.Item>
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
              {/* <UploadComp
                name="file"
                showUploadList={false}
                buttonName={t('title.audioFrequencyUpload')}
                fileType={'audio'}
              /> */}
              <UploadComp
                // listType="text"
                fileType={'audio'}
                domain="BOOK"
                onOk={(data) =>
                  form.setFieldsValue({
                    audioId: data.id,
                    audioUrl: data.objectUrl,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              name="img"
              label={t('title.image')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.uploadImage')}`,
                },
              ]}
            >
              <UploadComp
                domain="BOOK"
                initUrl={initFormData?.imgUrl}
                onOk={(data) =>
                  form.setFieldsValue({
                    bookImgId: data.id,
                    bookImgUrl: data.objectUrl,
                  })
                }
              />
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
