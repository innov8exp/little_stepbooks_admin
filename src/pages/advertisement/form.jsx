import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Input, message, Modal, Select, Upload } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import DebounceSelect from '@/components/debounce-select'
import HttpStatus from 'http-status-codes'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@/locales/i18n'

const { Option } = Select

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

const AdvertisementForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/advertisements/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            setImageUrl(res.data.adsImg)
            form.setFieldsValue({
              ...res.data,
              bookName: {
                label: res.data.bookName,
                value: res.data.bookId,
              },
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/advertisements`, {
        ...values,
        bookName: values.label,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(i18n.t('message.successInfo'))
          onSave()
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`)
      })
  }

  const updateData = (values) => {
    axios
      .put(`/api/admin/v1/advertisements/${id}`, {
        ...values,
        bookName: values.label,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(i18n.t('message.successInfo'))
          onSave()
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`)
      })
  }

  const okHandler = () => {
    form
      .validateFields()
      .then((values) => {
        if (id) {
          updateData(values)
        } else {
          createData(values)
        }
      })
      .catch()
  }

  const fetchBook = async (value) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/admin/v1/books?bookName=${value}&currentPage=1&pageSize=10`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const books = results.records
            const options = books.map((item) => ({
              label: item.bookName,
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

  const handleSelectChangeAction = (optionValue) => {
    form.setFieldsValue({
      bookId: optionValue,
    })
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
      <div style={{ marginTop: 8 }}>宣传图上传</div>
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
          form.setFieldsValue({ adsImg: res.data })
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
  }
  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title="广告表单"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item name="bookId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="bookName"
          label="书籍"
          rules={[
            {
              required: true,
              message: '请选择书籍',
            },
          ]}
        >
          <DebounceSelect
            showSearch
            fetchOptions={fetchBook}
            placeholder="请输入书籍名称搜索"
            onChange={({ value }) => handleSelectChangeAction(value)}
          />
        </Form.Item>
        <Form.Item
          name="adsType"
          label="广告类型"
          rules={[
            {
              required: true,
              message: '请选择广告类型',
            },
          ]}
        >
          <Select>
            <Option value="RECOMMEND">推荐</Option>
            <Option value="CAROUSEL">轮播</Option>
          </Select>
        </Form.Item>
        <Form.Item name="adsImg" label="封面">
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
        <Form.Item name="introduction" label="简介">
          <TextArea rows={3} style={{ resize: 'none' }} />
        </Form.Item>
        <Form.Item name="sortIndex" label="显示顺序">
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
AdvertisementForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default AdvertisementForm
