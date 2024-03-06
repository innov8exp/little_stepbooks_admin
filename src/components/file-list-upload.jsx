import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const FileListUpload = ({
  domain,
  permission = 'PUBLIC',
  buttonName,
  listType = 'text',
  accept,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Upload
        name="file"
        accept={accept}
        listType={listType}
        action={`/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`}
        withCredentials
        {...props}
      >
        <Button icon={<UploadOutlined />}>
          {buttonName ? buttonName : t('title.upload')}
        </Button>
      </Upload>
    </>
  )
}
FileListUpload.propTypes = {
  domain: PropTypes.string.isRequired,
  permission: PropTypes.string,
  buttonName: PropTypes.string,
  listType: PropTypes.string,
  accept: PropTypes.string,
}

export default FileListUpload
