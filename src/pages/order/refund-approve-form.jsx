import { Form, Input, message, Modal, Select } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const RefundApproveForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const createData = (values) => {
    axios
      .put(`/api/admin/v1/orders/${id}/ship`, { ...values })
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
      .put(`/api/admin/v1/inventories/${id}`, { ...values })
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
      width={640}
      title={t('title.ship')}
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
          name="shipCompany"
          label={t('title.shipCompany')}
          rules={[
            {
              required: true,
              message: t('message.check.shipCompany'),
            },
          ]}
        >
          <Select placeholder={t('message.placeholder.selectShipCompany')}>
            <Select.Option value="顺丰快递">顺丰快递</Select.Option>
            <Select.Option value="中通快递">中通快递</Select.Option>
            <Select.Option value="圆通快递">圆通快递</Select.Option>
            <Select.Option value="韵达快递">韵达快递</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="shipCode"
          label={t('title.shipCode')}
          rules={[
            {
              required: true,
              message: t('message.check.shipCode'),
            },
          ]}
        >
          <Input placeholder={t('message.check.shipCode')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
RefundApproveForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default RefundApproveForm
