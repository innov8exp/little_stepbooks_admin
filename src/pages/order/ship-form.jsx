import useFetch from '@/hooks/useFetch'
import { Form, Input, message, Modal, Select } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const ShipForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const { fetchedData } = useFetch('/api/admin/v1/orders/ship-companies', [])

  const createData = (values) => {
    axios
      .put(`/api/admin/v1/orders/${id}/shipment`, { ...values })
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
            {fetchedData?.map(({ code, name }) => (
              <Select.Option key={code} value={code}>
                {name}
              </Select.Option>
            ))}
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
ShipForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default ShipForm
