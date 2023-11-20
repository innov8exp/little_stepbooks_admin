import { Form, Input, InputNumber, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const InventoryForm = ({ record, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const createData = (values) => {
    console.log(values)
    axios
      .post(`/api/admin/v1/inventories`, { ...record, ...values })
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
        createData(values)
      })
      .catch()
  }
  return (
    <Modal
      open={visible}
      width={640}
      title={t('title.inventory')}
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
        initialValues={{ ...record }}
        name="form_in_modal"
      >
        <Form.Item name="skuCode" label={t('title.skuCode')}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="skuName" label={t('title.skuName')}>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="inventoryQuantity"
          label={t('title.inventoryQuantity')}
          rules={[
            {
              required: true,
              message: t('message.check.inventoryQuantity'),
            },
          ]}
        >
          <InputNumber placeholder={t('message.check.inventoryQuantity')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
InventoryForm.propTypes = {
  record: PropTypes.object,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default InventoryForm
