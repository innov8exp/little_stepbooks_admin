import { UploadOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { Form, message, Upload, Button } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const UploadForm = ({ buttonName, fileType }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [setUploading] = useState(false)
  const [setImageUrl] = useState()

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setUploading(false)
        setImageUrl(url)
      })
    }
  }

  // const uploadButton = (
  //   <div>
  //     {uploading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>{t('title.audioFrequencyUpload')}</div>
  //   </div>
  // )

  const handleUpload = (options) => {
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
        // setLoading(false)
      })
  }
  const beforeUpload = (file) => {
    if (fileType === 'audio') {
      checkFileVideoType(file)
    }

    checkSize(file)
  }

  const checkFileVideoType = (file) => {
    return new Promise((resolve, reject) => {
      const isVideo = file.type === 'audio/mp3' || file.type === 'audio/mpeg'

      if (!isVideo) {
        reject(message.error('You can only upload audio file!'))
      } else {
        resolve()
      }
    })
  }

  const checkSize = (file) => {
    return new Promise((resolve, reject) => {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
        reject()
      } else {
        resolve()
      }
    })
  }

  // const fileList = [
  //   {
  //     uid: '1',
  //     name: 'xxx.png',
  //     status: 'uploading',
  //     url: 'http://www.baidu.com/xxx.png',
  //     percent: 33,
  //   },
  //   {
  //     uid: '2',
  //     name: 'yyy.png',
  //     status: 'done',
  //     url: 'http://www.baidu.com/yyy.png',
  //   },
  //   {
  //     uid: '3',
  //     name: 'zzz.png',
  //     status: 'error',
  //     response: 'Server Error 500',
  //     url: 'http://www.baidu.com/zzz.png',
  //   },
  // ]
  return (
    <Upload
      name="file"
      // listType="picture"
      // style={{ width: 240, height: 320 }}
      // defaultFileList={[...fileList]}
      showUploadList={true}
      customRequest={handleUpload}
      beforeUpload={beforeUpload}
      onChange={handleUploadChange}
    >
      <Button icon={<UploadOutlined />}>{buttonName}</Button>
    </Upload>
  )
}
UploadForm.propTypes = {
  buttonName: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
}

export default UploadForm
