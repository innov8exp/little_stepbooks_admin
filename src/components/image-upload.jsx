import React, { useState, useEffect } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload, Button } from 'antd';
import PropTypes from 'prop-types'

const ImageUpload = ({
  domain = 'DEFAULT',
  permission = 'PUBLIC',
  value = null,
  onChange = (e) => {
    console.log(e)
  }
}) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState(value ? [{ url: value, response: { objectUrl: value } }] : []);
  const [resUrl, setResUrl] = useState(); // 上一次上传的服务器获取的链接

  useEffect(() => {
    if(value){
      value != resUrl && setFileList([{ url: value, response: { objectUrl: value } }])
    }else{
      setFileList([])
    }
  }, [value, resUrl])

  const handleChange = function(info) {
    const {file: { status, response }, fileList} = info
    setFileList(fileList)
    if (status === 'uploading') {
      setLoading(true);
      return;
    }
    if (status === 'done') {
      setResUrl(response.objectUrl)
      onChange({
        url: response.objectUrl,
        id: response.id,
      })
      setLoading(false)
    }
  }

  const handleRemove = function(){
    setLoading(false);
    setResUrl(null)
    onChange({
      url: null,
      id: null
    })
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  return (
    <Upload
      name="file"
      accept='.jpg,.jpeg,.png,.gif'
      listType="picture"
      maxCount={1}
      fileList={fileList}
      showUploadList={true}
      action={`/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      onRemove={handleRemove}
    >
      { fileList.length > 0 ? null : <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>Upload</Button> }
    </Upload>
  )
};
ImageUpload.propTypes = {
  domain: PropTypes.string,
  permission: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}
export default ImageUpload;