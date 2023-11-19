import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

const ImageUpload = ({
  domain,
  permission = 'PUBLIC',
  buttonName,
  listType = 'picture-card',
  initUrl,
  style = { width: 240, height: 320 },
  onOk = (data) => {
    console.log(data)
  },
  onErr = (err) => {
    console.error(err)
  },
  ...props
}) => {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const handleUpload = (options) => {
    setUploading(true)
    setImageUrl('')
    const { onSuccess, onError, file } = options
    const fmData = new FormData()
    fmData.append('file', file)
    axios
      .post(
        `/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`,
        fmData,
        {
          headers: { 'content-type': 'multipart/form-data' },
        },
      )
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          onSuccess(res.data)
          message.success(`${file.name} file uploaded successfully.`)
          getBase64(file, (url) => {
            setImageUrl(url)
          })
          onOk(res.data)
        }
      })
      .catch((err) => {
        onError(err)
        message.error(`${file.name} file upload failed.`)
        onErr(err)
      })
      .finally(() => setUploading(false))
  }

  useEffect(() => {
    setImageUrl(initUrl)
  }, [initUrl])

  // const handleUploadChange = (info) => {
  //   console.log('my-info:', info)
  //   if (info.file.status === 'uploading') {
  //     setUploading(true)
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully.`)
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (url) => {
  //       setUploading(false)
  //       setImageUrl(url)
  //     })
  //     const resData = info.file.response
  //     onOk(resData)
  //     // form.setFieldsValue({
  //     //   bookImgId: resData.id,
  //     //   bookImgUrl: resData.objectUrl,
  //     // })
  //   }
  //   if (info.file.status === 'error') {
  //     setUploading(false)
  //     message.error(`${info.file.name} file upload failed.`)
  //     const resData = info.file.response
  //     onErr(resData)
  //   }
  // }

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {buttonName ? buttonName : t('title.coverUpload')}
      </div>
    </div>
  )

  return (
    <>
      <Upload
        name="file"
        listType={listType}
        style={style}
        showUploadList={false}
        beforeUpload={beforeUpload}
        // onChange={handleUploadChange}
        customRequest={handleUpload}
        {...props}
      >
        {imageUrl ? (
          <img src={imageUrl} style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  )
}
ImageUpload.propTypes = {
  domain: PropTypes.string.isRequired,
  permission: PropTypes.string,
  buttonName: PropTypes.string,
  listType: PropTypes.string,
  style: PropTypes.object,
  initUrl: PropTypes.string,
  onOk: PropTypes.func,
  onErr: PropTypes.func,
}

export default ImageUpload
