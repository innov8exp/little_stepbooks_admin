import {
  LeftCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Skeleton,
  Upload,
} from 'antd'
import { Routes } from '@/libs/router'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import useQuery from '@/hooks/useQuery'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import i18n from '@/locales/i18n'

const { Option } = Select
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

const BookForm = () => {
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState({
    isSerialized: false,
    hasEnding: true,
  })
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const categoryDict = useFetch('/api/admin/v1/categories', [])
  // const selectedCategories = useFetch(
  //     `/api/admin/v1/books/${queryId}/categories`,
  //     [queryId],
  // );

  const selectedCategoryList = (bookId) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/admin/v1/books/${bookId}/categories`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            resolve(res.data)
          }
        })
        .catch((err) => {
          message.error(
            `${i18n.t('message.error.failureReason')}${
              err.response?.data?.message
            }`,
          )
          reject(err)
        })
    })
  }

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
          setImageUrl(resultData.coverImg)
          setInitFormData({
            ...resultData,
          })
        }
      })
      .catch((err) => {
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        )
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
    selectedCategoryList(queryId).then((selected) => {
      form.setFieldsValue({
        categories: Array.from(new Set(selected.flatMap((mData) => mData.id))),
      })
    })
  }, [form, queryId])

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/books', {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(Routes.BOOK_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (book) => {
    console.log('categories:', book.category)
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/books/${queryId}`, {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(Routes.BOOK_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const handleSaveAction = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('数字：', values)
        if (queryId) {
          updateData({
            ...values,
            categories: Array.from(new Set(values.categories)),
          })
        } else {
          createData({
            ...values,
            categories: Array.from(new Set(values.categories)),
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
      <div style={{ marginTop: 8 }}>封面上传</div>
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
            onClick={() => navigate(Routes.BOOK_LIST.path)}
          />
          {i18n.t('button.bookEditing')}
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
            <Divider orientation="left">基本信息</Divider>
            <Form.Item
              name="bookName"
              label={i18n.t('bookName')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.bookName')}`,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="author"
              label={i18n.t('title.author')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.enterAuthor')}`,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="categories"
              label={i18n.t('title.classification')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.selectClassification')}`,
                },
              ]}
            >
              <Checkbox.Group>
                {categoryDict.fetchedData?.map((cate) => {
                  return (
                    <Checkbox value={cate.id} key={cate.id}>
                      {cate.categoryName}
                    </Checkbox>
                  )
                })}
              </Checkbox.Group>
            </Form.Item>
            <Form.Item name="keywords" label={i18n.t('title.keyword')}>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder={i18n.t('message.check.searchKeywords')}
              />
            </Form.Item>
            <Form.Item
              name="introduction"
              label={i18n.t('title.bookIntroduction')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.bookIntroduction')}`,
                },
              ]}
            >
              <TextArea rows={2} style={{ resize: 'none' }} />
            </Form.Item>
            <Form.Item
              name="coverImg"
              label={i18n.t('title.cover')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.uploadCoverImage')}`,
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
            <Divider orientation="left">
              {i18n.t('title.bookProperties')}
            </Divider>
            <Form.Item
              name="chargeType"
              label={i18n.t('title.paymentType')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.selectPaymentType')} `,
                },
              ]}
            >
              <Select>
                <Option value="FREE">
                  {i18n.t('select.option.allChapterFree')}
                </Option>
                <Option value="FULL_CHARGE">
                  {i18n.t('select.option.allChapterPay')}
                </Option>
                <Option value="PART_CHARGE">
                  {' '}
                  {i18n.t('select.option.PartialChapterPay')}
                </Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label={i18n.t('title.chapterUnitPrice')}
              rules={[
                {
                  required: true,
                  message: `${i18n.t('message.check.unitPrice')}`,
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="isSerialized"
              label={i18n.t('title.publishInInstalments')}
            >
              <Radio.Group>
                <Radio value>{i18n.t('radio.label.yes')}</Radio>
                <Radio value={false}>{i18n.t('radio.label.deny')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="hasEnding" label={i18n.t('title.end')}>
              <Radio.Group>
                <Radio value>{i18n.t('radio.label.yes')}</Radio>
                <Radio value={false}>{i18n.t('radio.label.deny')}</Radio>
              </Radio.Group>
            </Form.Item>

            <div style={{ marginTop: 10 }} />
            <Row justify="end">
              <Col>
                <Button type="default" onClick={() => form.resetFields()}>
                  {i18n.t('button.reset')}
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button
                  loading={saveLoading}
                  type="primary"
                  onClick={() => handleSaveAction()}
                >
                  {i18n.t('button.saveData')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>{i18n.t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default BookForm
