import FileListUpload from '@/components/file-list-upload'
import ImageListUpload from '@/components/image-list-upload'
import { Form, Input, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'


const MediaForm = ({ id, visible, isAudio, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const params = useParams()
  const goodsId = params?.id;
  const getUrl = `/api/admin/v1/virtual-goods-${isAudio ? 'audio' : 'video'}/${id}`
  const newUrl = `/api/admin/v1/virtual-goods-${isAudio ? 'audio' : 'video'}`

  useEffect(() => {
    if (id) {
      axios
        .get(getUrl)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const { audioId, audioUrl, videoId, videoUrl, coverId, coverUrl } = res.data
            const mediaArr = [];
            const coverImgArr = []
            let id, url; 
            if (isAudio) {
              id = audioId
              url = audioUrl
            }else if(videoId){
              id = videoId
              url = videoUrl
              if(coverId){
                coverImgArr.push({
                  id: coverId,
                  url: coverUrl,
                  name: coverUrl?.split('/')?.pop(),
                  response: {
                    id: coverId,
                    objectUrl: coverUrl,
                  }
                })
              }
            }
            mediaArr.push({
              id,
              url,
              name: url?.split('/')?.pop(),
              response: {
                id,
                objectUrl: url,
              }
            })
            form.setFieldsValue({
              ...res.data,
              mediaArr,
              coverImgArr
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    } else {
      form.resetFields()
    }
  }, [id, form, isAudio, visible])

  const createData = (values) => {
    axios
      .post(newUrl, {
        ...values,
        goodsId
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(t('message.successInfo'))
          onSave()
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`)
      })
  }

  const updateData = (values) => {
    axios
      .put(getUrl, {
        ...values
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(t('message.successInfo'))
          onSave()
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`)
      })
  }

  const beforeMediaUpload = (file) => {
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
        form.setFieldValue('duration', `${minute}:${second}`)
        form.setFieldValue('name', file.name.split('.')[0])
      });
    })
  }

  const okHandler = () => {
    form
      .validateFields()
      .then((values) => {
        const { name, duration, mediaArr, coverImgArr } = values;
        // 准备默认值
        const sendData = {
          name,
          duration,
          goodsId
        };
        if(mediaArr && mediaArr.length > 0){
          if(isAudio){
            sendData.audioId = mediaArr[0].response.id
            sendData.audioUrl = mediaArr[0].response.objectUrl
          }else{
            sendData.videoId = mediaArr[0].response.id
            sendData.videoUrl = mediaArr[0].response.objectUrl
          }
          if(coverImgArr && coverImgArr.length > 0){
            sendData.coverId = coverImgArr[0].response.id
            sendData.coverUrl = coverImgArr[0].response.objectUrl
          }
        }
        if (id) {
          updateData(sendData)
        } else {
          createData(sendData)
        }
      })
      .catch(err => err)
  }

  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={isAudio ? t('title.audioForm') : t('title.videoForm')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item
          name="mediaArr"
          label={ isAudio ? t('title.audio') : t('title.video') }
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e
            }
            return e?.fileList
          }}
        >
          <FileListUpload beforeUpload={beforeMediaUpload} domain={'PRODUCT'} accept={isAudio ? '.mp3,.m4a' : '.mp4'} maxCount={1} />
        </Form.Item>
        <Form.Item name="duration" label={t('title.duration')}>
          <Input type="text" style={{ width: '150px' }} disabled />
        </Form.Item>
        <Form.Item name="name" label={t('title.name')}>
          <Input type="text" placeholder={t('message.placeholder.name')} />
        </Form.Item>
        {
          <Form.Item
            name="coverImgArr"
            label={t('title.cover')}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              return e?.fileList
            }}
          >
            <ImageListUpload domain={'PRODUCT'} maxCount={1} />
          </Form.Item>
        }
      </Form>
    </Modal>
  )
}
MediaForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  isAudio: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default MediaForm
