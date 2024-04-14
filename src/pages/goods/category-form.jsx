import ImageListUpload from '@/components/image-list-upload'
import { Form, Input, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'


const CategoryForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/virtual-category/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const resultData = res.data
            const imgArr = []
            if (resultData.coverId) {
              imgArr.push({
                id: resultData.coverId,
                name: resultData.coverUrl?.split('/')?.pop(),
                url: resultData.coverUrl,
                response: {
                  id: resultData.coverId,
                  objectUrl: resultData.coverUrl,
                }
              })
            }
            form.setFieldsValue({
              ...res.data,
              imgArr
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    } else {
      form.resetFields()
    }
  }, [id, form, visible])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/virtual-category`, {
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
      .put(`/api/admin/v1/virtual-category/${id}`, {
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
        const { name, description, imgArr } = values;
        const sendData = { name, description };
        if(imgArr && imgArr.length > 0){
          sendData.coverId = imgArr[0].response.id
          sendData.coverUrl = imgArr[0].response.objectUrl
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
        <Form.Item
          name="imgArr"
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
      </Form>
    </Modal>
  )
}
CategoryForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default CategoryForm
