import { Form, Input, message, Modal } from 'antd'
import Axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const CategoryForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  useEffect(() => {
    if (id) {
      Axios.get(`/api/admin/v1/categories/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({ ...res.data })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const createData = (values) => {
    Axios.post(`/api/admin/v1/categories`, { ...values })
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
    Axios.put(`/api/admin/v1/categories/${id}`, { ...values })
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
      title={t('title.classificationForm')}
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
        <Form.Item
          name="categoryName"
          label={t('title.name')}
          rules={[
            {
              required: true,
              message: t('message.check.name'),
            },
          ]}
        >
          <Input placeholder={t('message.check.name')} maxLength={20} />
        </Form.Item>
        <Form.Item name="description" label={t('title.describe')}>
          <Input
            placeholder={t('message.placeholder.describe')}
            maxLength={50}
          />
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
