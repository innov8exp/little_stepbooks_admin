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
          message.error(`操作失败，原因：${err.response?.data?.message}`)
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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
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
          小说编辑
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
              label="书名"
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
              label="作者"
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
              name="categories"
              label="分类"
              rules={[
                {
                  required: true,
                  message: '请选择分类',
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
            <Form.Item name="keywords" label="关键词">
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="请输入可搜索关键词"
              />
            </Form.Item>
            <Form.Item
              name="introduction"
              label="书籍介绍"
              rules={[
                {
                  required: true,
                  message: '请输入书籍介绍',
                },
              ]}
            >
              <TextArea rows={2} style={{ resize: 'none' }} />
            </Form.Item>
            <Form.Item
              name="coverImg"
              label="封面"
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
            <Divider orientation="left">小说属性</Divider>
            <Form.Item
              name="chargeType"
              label="付费类型"
              rules={[
                {
                  required: true,
                  message: '请选择付费类型',
                },
              ]}
            >
              <Select>
                <Option value="FREE">全部章节免费</Option>
                <Option value="FULL_CHARGE">全部章节付费</Option>
                <Option value="PART_CHARGE">部分章节付费</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="章节单价(书币)"
              rules={[
                {
                  required: true,
                  message: '请输入单价',
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="isSerialized" label="连载">
              <Radio.Group>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="hasEnding" label="完结">
              <Radio.Group>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>

            <div style={{ marginTop: 10 }} />
            <Row justify="end">
              <Col>
                <Button type="default" onClick={() => form.resetFields()}>
                  重置
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button
                  loading={saveLoading}
                  type="primary"
                  onClick={() => handleSaveAction()}
                >
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

export default BookForm
