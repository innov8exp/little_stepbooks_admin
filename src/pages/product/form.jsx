import { Form, Input, message, Modal, Select } from 'antd'
import Axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const ProductForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
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
          message.success(t('message.successInfo'))
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
      title={t('title.label.productPackageForm')}
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
        {/* <Form.Item name="coinAmount" label="编号" required>
                    <Input readOnly />
                </Form.Item> */}
        <Form.Item
          name="coinAmount"
          label={t('title.label.numberOfBookCoins')}
          rules={[
            {
              required: true,
              message: `${t('message.placeholder.enterQuantityOfBook')}`,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label={t('title.label.price')}
          rules={[
            {
              required: true,
              message: `${t('message.placeholder.enterPrice')}`,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="platform"
          label={t('title.label.platform')}
          rules={[
            {
              required: true,
              message: `${t('message.placeholder.electPlatform')}`,
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
          label={t('title.label.platformProductID')}
          rules={[
            {
              required: true,
              message: `${t('message.placeholder.electPlatformID')}`,
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
