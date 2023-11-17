import { ExclamationCircleOutlined } from '@ant-design/icons'
import { App, Form, Modal, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const RefundRejectForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { modal } = App.useApp()

  const createData = (values) => {
    modal.confirm({
      title: `${t('message.tips.reject')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/refund-requests/${id}/reject`, { ...values })
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
      >
        <Form.Item
          name="rejectReason"
          label={t('title.rejectReason')}
          rules={[
            {
              required: true,
              message: t('message.check.rejectReason'),
            },
          ]}
        >
          <TextArea rows={2} placeholder={t('message.check.rejectReason')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
RefundRejectForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default RefundRejectForm
