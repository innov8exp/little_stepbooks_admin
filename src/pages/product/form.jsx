import DebounceSelect from '@/components/debounce-select'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
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
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
  Upload,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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

const ProductForm = () => {
  const { t } = useTranslation()
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
  const [initBookSetOptions, setInitBookSetOptions] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ])

  const initData = useCallback(() => {
    fetchBookSet().then((res) => setInitBookSetOptions(res))
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/products/${queryId}`)
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
  }, [queryId, t])

  const createData = (createdData) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/products', {
        ...createdData,
        salesPlatform: createdData?.salesPlatform?.join(','),
        resources: createdData?.resources?.join(','),
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.PRODUCT_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (updateData) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/products/${queryId}`, {
        ...updateData,
        salesPlatform: updateData?.salesPlatform?.join(','),
        resources: updateData?.resources?.join(','),
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.PRODUCT_LIST.path)
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
        if (queryId) {
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
      .post(`/api/admin/v1/products/upload`, fmData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          onSuccess()
          form.setFieldsValue({
            coverImgId: res.data.id,
            coverImgUrl: res.data.object_url,
          })
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

  const fetchBookSet = async (value) => {
    return new Promise((resolve, reject) => {
      let url = `/api/admin/v1/book-sets?name=${value}&currentPage=1&pageSize=10`
      if (!value) {
        url = `/api/admin/v1/book-sets?currentPage=1&pageSize=10`
      }
      axios
        .get(url)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const bookSets = results.records
            const options = bookSets.map((item) => ({
              label: item.name,
              value: item.id,
            }))
            resolve(options)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  useEffect(() => {
    initData()
  }, [initData])

  const uploadMediaButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  )

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    )
  }
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  return (
    <>
      <Card
        title={
          <>
            <Button
              type="link"
              size="large"
              icon={<LeftCircleOutlined />}
              onClick={() => navigate(Routes.PRODUCT_LIST.path)}
            />
            {t('button.productEditing')}
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
                salesPlatform: initFormData?.salesPlatform?.split(','),
                resources: initFormData?.resources?.split(','),
              }}
            >
              <Form.Item name="skuCode" label={t('title.skuCode')}>
                <Input readOnly />
              </Form.Item>
              <Form.Item
                name="skuName"
                label={t('title.name')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.name')}`,
                  },
                ]}
              >
                <Input placeholder={t('message.check.name')} maxLength={20} />
              </Form.Item>
              <Form.Item name="description" label={t('title.describe')}>
                <TextArea
                  rows={3}
                  style={{ resize: 'none' }}
                  placeholder={t('message.placeholder.describe')}
                />
              </Form.Item>
              <Form.Item
                name="salesPlatform"
                label={t('title.salesPlatform')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.salesPlatform')}`,
                  },
                ]}
              >
                <Checkbox.Group placeholder={t('message.check.salesPlatform')}>
                  <Checkbox value="MINI_PROGRAM" key="MINI_PROGRAM">
                    MINI_PROGRAM
                  </Checkbox>
                  <Checkbox value="ANDROID" key="ANDROID">
                    ANDROID
                  </Checkbox>
                  <Checkbox value="IOS" key="IOS">
                    IOS
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="productNature"
                label={t('title.productNature')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.productNature')}`,
                  },
                ]}
              >
                {' '}
                <Select
                  defaultValue="PHYSICAL"
                  options={[
                    {
                      value: 'PHYSICAL',
                      label: t('PHYSICAL'),
                    },
                    {
                      value: 'VIRTUAL',
                      label: t('VIRTUAL'),
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="bookSetId" label={t('title.bookSet')}>
                <DebounceSelect
                  showSearch
                  initOptions={initBookSetOptions}
                  fetchOptions={fetchBookSet}
                  placeholder={t('message.placeholder.enterBookSetSearch')}
                />
              </Form.Item>
              <Form.Item name="resources" label={t('title.resources')}>
                <Checkbox.Group placeholder={t('message.check.resources')}>
                  <Checkbox value="AUDIO" key="AUDIO">
                    AUDIO
                  </Checkbox>
                  <Checkbox value="COURSE" key="COURSE">
                    COURSE
                  </Checkbox>
                  <Checkbox value="EXERCISE" key="EXERCISE">
                    EXERCISE
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="price"
                label={t('title.price')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.price')}`,
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder={t('message.check.price')}
                  prefix="￥"
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  precision={2}
                />
              </Form.Item>
              <Form.Item
                name="coverImg"
                label={t('title.cover')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.uploadCoverImage')}`,
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
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                name="media"
                label={t('title.media')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.media')}`,
                  },
                ]}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : uploadMediaButton}
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
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  )
}

export default ProductForm
