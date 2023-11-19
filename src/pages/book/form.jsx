import ImageListUpload from '@/components/image-list-upload'
import useFetch from '@/hooks/useFetch'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
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

const BookForm = () => {
  const { t } = useTranslation()
  const params = useParams()
  const queryId = params?.id
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)

  const classifications = useFetch('/api/admin/v1/classifications', [])

  const selectedClassifications = useCallback(
    (bookId) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/admin/v1/books/${bookId}/classifications`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              resolve(res.data)
            }
          })
          .catch((err) => {
            message.error(
              `${t('message.error.failureReason')}${
                err.response?.data?.message
              }`,
            )
            reject(err)
          })
      })
    },
    [t],
  )

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/books/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          const bookImgArr = []
          if (resultData.bookImgId) {
            bookImgArr.push({
              id: resultData.bookImgId,
              name: resultData.bookImgUrl?.split('/')?.pop(),
              url: resultData.bookImgUrl,
              response: {
                id: resultData.bookImgId,
                objectUrl: resultData.bookImgUrl,
              },
            })
          }
          setInitFormData({
            ...resultData,
            bookImg: bookImgArr,
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
    selectedClassifications(queryId).then((selected) => {
      form.setFieldsValue({
        classifications: Array.from(
          new Set(selected.flatMap((mData) => mData.id)),
        ),
      })
    })
  }, [form, queryId, selectedClassifications, t])

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/books', {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate('/books')
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err?.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (book) => {
    console.log('classifications:', book.category)
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/books/${queryId}`, {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate('/books')
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
            classifications: Array.from(new Set(values.classifications)),
            bookImgId: values.bookImg?.[0]?.response?.id,
            bookImgUrl: values.bookImg?.[0]?.response?.objectUrl,
          })
        } else {
          createData({
            ...values,
            classifications: Array.from(new Set(values.classifications)),
            bookImgId: values.bookImg?.[0]?.response?.id,
            bookImgUrl: values.bookImg?.[0]?.response?.objectUrl,
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
          {t('button.bookEditing')}
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
              name="bookName"
              label={t('title.bookName')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.bookName')}`,
                },
              ]}
            >
              <Input placeholder={t('message.check.bookName')} maxLength={20} />
            </Form.Item>
            <Form.Item
              name="author"
              label={t('title.author')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.enterAuthor')}`,
                },
              ]}
            >
              <Input
                placeholder={t('message.check.enterAuthor')}
                maxLength={20}
              />
            </Form.Item>
            <Form.Item
              name="classifications"
              label={t('title.classification')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.selectClassification')}`,
                },
              ]}
            >
              <Checkbox.Group
                placeholder={t('message.check.selectClassification')}
              >
                {classifications.fetchedData?.map((cate) => {
                  return (
                    <Checkbox value={cate.id} key={cate.id}>
                      {cate.classificationName}
                    </Checkbox>
                  )
                })}
              </Checkbox.Group>
            </Form.Item>
            <Form.Item name="description" label={t('title.describe')}>
              <TextArea
                rows={3}
                style={{ resize: 'none' }}
                placeholder={t('message.placeholder.describe')}
              />
            </Form.Item>
            <Form.Item
              name="bookImg"
              label={t('title.image')}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e
                }
                return e?.fileList
              }}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.uploadImage')}`,
                },
              ]}
            >
              <ImageListUpload domain={'BOOK'} maxCount={1} />
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

export default BookForm
