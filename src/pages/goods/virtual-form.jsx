import { Form, Input, Modal, message, Select, InputNumber } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'


const VirtualForm = ({ id, visible, categoryArr, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/virtual-goods/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue(res.data)
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    } else {
      form.resetFields()
    }
  }, [id, form, visible])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/virtual-goods`, {
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
      .put(`/api/admin/v1/virtual-goods/${id}`, {
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
        console.log(values)
        if (id) {
          updateData(values)
        } else {
          createData(values)
        }
      })
      .catch()
  }

  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={t('title.virtualGoodsForm')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
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
        <Form.Item label={t('title.productCategory')} name="categoryId">
          <Select placeholder={t('message.placeholder.bookAuthor')} options={ categoryArr }></Select>
        </Form.Item>
        <Form.Item label={t('title.totalMonth')} name="toAddMonth">
          <InputNumber min={0} max={120} defaultValue={null} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
VirtualForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  categoryArr: PropTypes.array,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default VirtualForm
