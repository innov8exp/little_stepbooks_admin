import React, { useState, useEffect } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload, Button, Image } from 'antd';
import PropTypes from 'prop-types'
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});
const ImageUpload = ({
  domain = 'DEFAULT',
  permission = 'PUBLIC',
  value = null,
  onChange = (e) => {
    console.log(e)
  }
}) => {
  const initData = value ? [{ 
    url: value,
    name: value.split('/').slice(-1)[0],
    response: { 
      objectUrl: value
    }
  }] : [];
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState(initData);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if(value){
      if(fileList.length > 0 && value === fileList[0].response.objectUrl){
        return
      }
      setFileList(initData)
    }else if(fileList.length > 0){
      setFileList([])
    }
  }, [value])

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = function(info) {
    const {file: { status, response }, fileList: newFileList} = info
    setFileList(newFileList)
    if (status === 'uploading') {
      setLoading(true);
      return;
    }
    if (status === 'done') {
      onChange({
        url: response.objectUrl,
        id: response.id,
      })
      setLoading(false)
    }
  }

  const handleRemove = function(){
    setLoading(false);
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
    <>
      <Upload
        name="file"
        accept='.jpg,.jpeg,.png,.gif'
        listType="picture"
        maxCount={1}
        fileList={fileList}
        showUploadList={true}
        action={`/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        { fileList.length > 0 ? null : <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>Upload</Button> }
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  )
};
ImageUpload.propTypes = {
  domain: PropTypes.string,
  permission: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}
export default ImageUpload;