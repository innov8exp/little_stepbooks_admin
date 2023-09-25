import { Form, Input, message, Modal, Select } from 'antd'
import Axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@/locales/i18n'

const { Option } = Select

const ProductForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (id) {
      Axios.get(`/api/admin/v1/products/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({ ...res.data })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const createData = (values) => {
    Axios.post(`/api/admin/v1/products`, { ...values })
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
    Axios.put(`/api/admin/v1/products/${id}`, { ...values })
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
      title="产品套餐表单"
      okText="保存"
      cancelText="取消"
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
        {/* <Form.Item name="coinAmount" label="编号" required>
                    <Input readOnly />
                </Form.Item> */}
        <Form.Item
          name="coinAmount"
          label="书币数量"
          rules={[
            {
              required: true,
              message: '请输入书币数量',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="价格（$）"
          rules={[
            {
              required: true,
              message: '请输入价格',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="platform"
          label="平台"
          rules={[
            {
              required: true,
              message: '请选择平台',
            },
          ]}
        >
          <Select>
            <Option value="IOS">iOS</Option>
            <Option value="ANDROID">Android</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="storeProductId"
          label="平台产品ID"
          rules={[
            {
              required: true,
              message: '请输入平台产品ID',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

ProductForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default ProductForm
