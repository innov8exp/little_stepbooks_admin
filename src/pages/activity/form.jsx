import ImageListUpload from '@/components/image-list-upload'
import { Form, Input, Modal, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'


const ActivityForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/paired-read-collection/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const resultData = res.data
            const coverImgArr = []
            const detailImgArr = []
            if (resultData.coverImgId) {
              coverImgArr.push({
                id: resultData.coverImgId,
                name: resultData.coverImgUrl?.split('/')?.pop(),
                url: resultData.coverImgUrl,
                response: {
                  id: resultData.coverImgId,
                  objectUrl: resultData.coverImgUrl,
                }
              })
            }
            if (resultData.detailImgId) {
              detailImgArr.push({
                id: resultData.detailImgId,
                name: resultData.detailImgUrl?.split('/')?.pop(),
                url: resultData.detailImgUrl,
                response: {
                  id: resultData.detailImgId,
                  objectUrl: resultData.detailImgUrl,
                }
              })
            }
            form.setFieldsValue({
              ...res.data,
              coverImgArr,
              detailImgArr
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
      .post(`/api/admin/v1/paired-read-collection`, {
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

  const updateData = (values) => {
    axios
      .put(`/api/admin/v1/paired-read-collection/${id}`, {
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

  const okHandler = () => {
    form
      .validateFields()
      .then((values) => {
        const { name, description, coverImgArr, detailImgArr } = values;
        const sendData = { name, description };
        if(coverImgArr && coverImgArr.length > 0){
          sendData.coverImgId = coverImgArr[0].response.id
          sendData.coverImgUrl = coverImgArr[0].response.objectUrl
        }
        if(detailImgArr && detailImgArr.length > 0){
          sendData.detailImgId = detailImgArr[0].response.id
          sendData.detailImgUrl = detailImgArr[0].response.objectUrl
        }
        console.log(values, sendData)
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
      title={t('title.activityForm')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item name="name" label={t('title.name')}>
          <Input type="text" placeholder={t('message.placeholder.name')} />
        </Form.Item>
        <Form.Item name="description" label={t('title.describe')}>
          <TextArea
            rows={3}
            style={{ resize: 'none' }}
            placeholder={t('message.placeholder.describe')}
          />
        </Form.Item>
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
          <ImageListUpload domain={'DEFAULT'} maxCount={1} />
        </Form.Item>
        <Form.Item
          name="detailImgArr"
          label={t('title.detailImage')}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e
            }
            return e?.fileList
          }}
        >
          <ImageListUpload domain={'DEFAULT'} maxCount={1} />
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
