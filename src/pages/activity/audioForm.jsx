import FileListUpload from '@/components/file-list-upload'
import { Form, Input, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'


const ActivityForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const params = useParams()
  const collectionId = params?.activityId;

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/paired-read/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const resultData = res.data
            const audioArr = []
            if (resultData.audioId) {
              audioArr.push({
                id: resultData.audioId,
                name: resultData.audioUrl?.split('/')?.pop(),
                url: resultData.audioUrl,
                response: {
                  id: resultData.audioId,
                  objectUrl: resultData.audioUrl,
                }
              })
            }
            form.setFieldsValue({
              ...res.data,
              audioArr,
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    } else {
      form.resetFields()
    }
  }, [id, form])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/paired-read`, {
        ...values,
        collectionId
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
      .put(`/api/admin/v1/paired-read/${id}`, {
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

  const beforeAudioUpload = (file) => {
    const url = URL.createObjectURL(file);
    //经测试，发现audio也可获取视频的时长
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
      });
    })
  }

  const okHandler = () => {
    form
      .validateFields()
      .then((values) => {
        const { name, duration, audioArr } = values;
        const sendData = { name, duration };
        if(audioArr && audioArr.length > 0){
          sendData.audioId = audioArr[0].response.id
          sendData.audioUrl = audioArr[0].response.objectUrl
        }
        if (id) {
          updateData(sendData)
        } else {
          createData(sendData)
        }
      })
      .catch()
  }

  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={t('title.audioForm')}
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
        <Form.Item name="name" label={t('title.name')}>
          <Input type="text" placeholder={t('message.placeholder.name')} />
        </Form.Item>
        <Form.Item
          name="audioArr"
          label={t('title.audio')}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e
            }
            return e?.fileList
          }}
        >
          <FileListUpload beforeUpload={beforeAudioUpload} domain={'DEFAULT'} accept={'.mp3,.m4a'} maxCount={1} />
        </Form.Item>
        <Form.Item name="duration" label={t('title.duration')}>
          <Input type="text" placeholder={t('message.placeholder.audioDuration')} disabled />
        </Form.Item>
      </Form>
    </Modal>
  )
}
ActivityForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default ActivityForm
