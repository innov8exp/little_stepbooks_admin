import React, { useState, useEffect } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';
import PropTypes from 'prop-types'
const FileUpload = ({
  domain = 'DEFAULT',
  permission = 'PUBLIC',
  value = null,
  accept = null,
  isMedia = false,
  onChange = (e) => {
    console.log(e)
  }
}) => {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [resUrl, setResUrl] = useState(); // 上一次上传的服务器获取的链接

  useEffect(() => {
    if(value){
      value != resUrl && setFileList([{ 
        url: value,
        name: value.split('/').slice(-1)[0],
        response: { objectUrl: value }
      }])
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
        duration
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
    if(!isMedia){
        return Promise.resolve(file)
    }
    const url = URL.createObjectURL(file);
    // audio可获取视频或音频的时长
    const audioCtx = new Audio(url);
    return new Promise((resolve) => {
        audioCtx.addEventListener("loadedmetadata", () => {
            resolve(file)
            const duration = Math.ceil(audioCtx.duration);
            let minute = Math.floor(duration / 60)
            minute = minute > 9 ? minute : '0' + minute;
            let second = duration % 60
            second = second > 9 ? second : '0' + second;
            setDuration(`${minute}:${second}`)
        })
    })
  }
  return (
    <Upload
      name="file"
      accept={accept}
      listType="text"
      fileList={fileList}
      showUploadList={true}
      action={`/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      onRemove={handleRemove}
    >
    { fileList.length > 0 ? null : <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>Upload</Button> }
  </Upload>
  );
};
FileUpload.propTypes = {
  domain: PropTypes.string,
  permission: PropTypes.string,
  value: PropTypes.string,
  accept: PropTypes.string,
  isMedia: PropTypes.bool,
  onChange: PropTypes.func
}
export default FileUpload;