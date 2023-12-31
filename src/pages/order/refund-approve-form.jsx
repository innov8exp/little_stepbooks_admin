import { ExclamationCircleOutlined } from '@ant-design/icons'
import { App, Form, InputNumber, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const RefundApproveForm = ({ id, data, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { modal } = App.useApp()

  const createData = (values) => {
    modal.confirm({
      title: `${t('message.tips.approve')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/refund-requests/${id}/approve`, { ...values })
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              onSave()
            }
          })
          .catch((err) => {
            message.error(
              `${t('message.error.failureReason')}${
                err.response?.data?.message
              }`,
            )
          })
      },
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
        initialValues={{ refundAmount: data?.refundAmount }}
      >
        <Form.Item
          name="refundAmount"
          label={t('title.refundAmount')}
          rules={[
            {
              required: true,
              message: t('message.check.refundAmount'),
            },
          ]}
        >
          <InputNumber
            style={{ width: 250 }}
            placeholder={t('message.check.refundAmount')}
            prefix="￥"
            formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            precision={2}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
RefundApproveForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default RefundApproveForm
