import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import PropTypes from 'prop-types'
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});
const ImagesUpload = ({
  domain = 'DEFAULT',
  permission = 'PUBLIC',
  value = [],
  maxCount = 8,
  onChange = (e) => {
    console.log(e)
  }
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState((value || []).map(({ imgId, imgUrl }) => ({
    uid: imgId,
    url: imgUrl,
    status: 'done',
    response: {
      id: imgId,
      objectUrl: imgUrl
    }
  })));
  useEffect(() => {
    if(value && value.length > 0){
      // 与组件属性存在差异需要更新组件数据
      if(value.length != fileList.length || value.some((item, index) => item.imgUrl != fileList[index].response.objectUrl)){
        setFileList(value.map((item, index) => {
          if(fileList[index] && item.imgUrl === fileList[index].response.objectUrl){
            return fileList[index]
          }
          return {
            uid: item.imgId,
            url: item.imgUrl,
            status: 'done',
            response: {
              id: item.imgId,
              objectUrl: item.imgUrl
            }
          }
        }))
      }
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
  const handleChange = ({ file: { status }, fileList: newFileList }) => {
    if (status === 'done' || status === 'removed') {
      onChange(newFileList.map(item => {
        return {
          imgId: item.response.id,
          imgUrl: item.response.objectUrl
        }
      }))
    }
    setFileList(newFileList)
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        cursor: 'pointer'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <>
      <Upload
        action={`/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`}
        listType="picture-card"
        fileList={fileList}
        maxCount={maxCount}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= maxCount ? null : uploadButton}
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
  );
};
ImagesUpload.propTypes = {
  domain: PropTypes.string,
  permission: PropTypes.string,
  value: PropTypes.array,
  maxCount: PropTypes.number,
  onChange: PropTypes.func
}
export default ImagesUpload;