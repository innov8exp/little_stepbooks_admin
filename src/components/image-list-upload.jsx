import { UploadOutlined } from '@ant-design/icons'
import { Button, Modal, Upload } from 'antd'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const ImageListUpload = ({
  domain,
  permission = 'PUBLIC',
  buttonName,
  listType = 'picture',
  ...props
}) => {
  const { t } = useTranslation()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const handleCancel = () => setPreviewOpen(false)

  const handleChange = (e) => {
    console.log(1111)
    console.log(e)
  }

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

  return (
    <>
      <Upload
        name="file"
        listType={listType}
        onPreview={handlePreview}
        action={`/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`}
        withCredentials
        onChange={handleChange}
        {...props}
      >
        <Button icon={<UploadOutlined />}>
          {buttonName ? buttonName : t('title.upload')}
        </Button>
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt={previewTitle}
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  )
}
ImageListUpload.propTypes = {
  domain: PropTypes.string.isRequired,
  permission: PropTypes.string,
  buttonName: PropTypes.string,
  listType: PropTypes.string,
}

export default ImageListUpload
