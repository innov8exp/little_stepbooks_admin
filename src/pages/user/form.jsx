import { Form, Input, message, Modal } from 'antd'
import Axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@/locales/i18n'

const UserForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if (id) {
      Axios.get(`/api/admin/v1/users/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({ ...res.data })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const createData = (values) => {
    Axios.post(`/api/admin/v1/users`, { ...values })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(i18n.t('message.successInfo'))
          onSave()
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`)
      })
  }

  const updateData = (values) => {
    Axios.put(`/api/admin/v1/users/${id}`, { ...values })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(i18n.t('message.successInfo'))
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
      width={500}
      style={{ maxHeight: 500 }}
      title={i18n.t('title.signForm')}
      okText={i18n.t('button.save')}
      cancelText={i18n.t('button.cancel')}
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
        <Form.Item
          name="username"
          label={i18n.t('title.name')}
          rules={[
            {
              required: true,
              message: i18n.t('message.check.name'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label={i18n.t('title.describe')}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
UserForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default UserForm
