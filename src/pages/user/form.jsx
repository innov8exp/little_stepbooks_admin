import { Form, Input, message, Modal, Select } from 'antd'
import Axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const UserForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  useEffect(() => {
    if (id) {
      Axios.get(`/api/admin/v1/users/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({ ...res.data })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const createData = (values) => {
    Axios.post(`/api/admin/v1/users`, { ...values })
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
    Axios.put(`/api/admin/v1/users/${id}`, { ...values })
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
      title={t('title.userForm')}
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
          name="userName"
          label={t('title.label.userNickName')}
          rules={[
            {
              required: true,
              message: t('message.placeholder.enterUserName'),
            },
          ]}
        >
          <Input
            placeholder={t('message.placeholder.enterUserName')}
            maxLength={10}
          />
        </Form.Item>
        <Form.Item
          name="userNickName"
          label={t('title.userNickname')}
          rules={[
            {
              required: true,
              message: t('message.check.userNickName'),
            },
          ]}
        >
          <Input placeholder={t('message.check.userNickName')} maxLength={20} />
        </Form.Item>
        <Form.Item
          name="email"
          label={t('title.email')}
          rules={[
            {
              required: true,
              message: t('message.check.email'),
            },
            {
              type: 'email',
              message: t('message.check.validEmail'),
            },
          ]}
        >
          <Input placeholder={t('message.check.email')} />
        </Form.Item>
        <Form.Item name="googleID" label={'GoogleID'}>
          <Input
            placeholder={t('message.placeholder.enterGooleID')}
            maxLength={20}
          />
        </Form.Item>
        <Form.Item name="facebookID" label={'FacebookID'}>
          <Input
            placeholder={t('message.placeholder.enterFacebookID')}
            maxLength={20}
          />
        </Form.Item>
        <Form.Item name="phone" label={t('title.phone')}>
          <Input
            placeholder={t('message.placeholder.enterPhone')}
            maxLength={10}
          />
        </Form.Item>
        <Form.Item name="gender" label={t('title.gender')}>
          <Select placeholder={t('message.placeholder.selectGender')}>
            <Select.Option value="male">
              {t('select.option.male')}
            </Select.Option>
            <Select.Option value="female">
              {t('select.option.female')}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
UserForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default UserForm
