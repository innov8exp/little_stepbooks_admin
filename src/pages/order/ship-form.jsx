import useFetch from '@/hooks/useFetch'
import { Form, Input, message, Modal, Select } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { deliveryCompanies } from '@/libs/deliveryCompanies'

const ShipForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  // const { fetchedData } = useFetch('/api/admin/v1/orders/ship-companies', [])
  const companies = deliveryCompanies

  const createData = (values) => {
    const logisticsType = values.deliveryCompany;
    const logisticsNo = values.deliveryCode;
    const logisticsName = companies.filter(item=>item.id === logisticsType)[0].name;
    const val = { logisticsType, logisticsNo, logisticsName };
    axios
      .put(`/api/admin/v1/orders/${id}/shipment`, { ...val })
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
          name="deliveryCompany"
          label={t('title.deliveryCompany')}
          rules={[
            {
              required: true,
              message: t('message.check.deliveryCompany'),
            },
          ]}
        >
          <Select placeholder={t('message.placeholder.selectDeliveryCompany')}>
            {deliveryCompanies?.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="deliveryCode"
          label={t('title.deliveryCode')}
          rules={[
            {
              required: true,
              message: t('message.check.deliveryCode'),
            },
          ]}
        >
          <Input placeholder={t('message.check.deliveryCode')} />
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
