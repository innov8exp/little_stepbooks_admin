import { Form, InputNumber, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { PropTypes } from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const BookQRCodeForm = ({ bookId, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/books-qrcode', {
        ...book,
        bookId,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          onSave()
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
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
      title={t('title.qrcode')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
      confirmLoading={saveLoading}
    >
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} form={form}>
        <Form.Item
          name="size"
          label={t('title.size')}
          rules={[
            {
              required: true,
              message: `${t('message.check.size')}`,
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('message.check.size')}
            maxLength={20}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

BookQRCodeForm.propTypes = {
  bookId: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default BookQRCodeForm
