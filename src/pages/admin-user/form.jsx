import ImageListUpload from '@/components/image-list-upload'
import { Form, Input, Modal, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const AdminUserForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/admin-users/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const resultData = res.data
            const avatarImgArr = []
            if (resultData.avatarImgId) {
              avatarImgArr.push({
                id: resultData.avatarImgId,
                name: resultData.avatarImgUrl?.split('/')?.pop(),
                url: resultData.avatarImgUrl,
                response: {
                  id: resultData.avatarImgId,
                  objectUrl: resultData.avatarImgUrl,
                },
              })
            }
            form.setFieldsValue({
              ...res.data,
              avatarImg: avatarImgArr,
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/admin-users`, {
        ...values,
      })
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
      .put(`/api/admin/v1/admin-users/${id}`, {
        ...values,
      })
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
          updateData({
            ...values,
            avatarImgId: values.avatarImg?.[0]?.response?.id,
            avatarImgUrl: values.avatarImg?.[0]?.response?.objectUrl,
            password:
              '{bcrypt}$2a$10$Mauvb3WBioPsOf9hZHX7l.np69XxobcoDn.kOEvcuu6YSafmqgQ6q',
            role: 'ADMIN',
          })
        } else {
          createData({
            ...values,
            avatarImgId: values.avatarImg?.[0]?.response?.id,
            avatarImgUrl: values.avatarImg?.[0]?.response?.objectUrl,
            password:
              '{bcrypt}$2a$10$Mauvb3WBioPsOf9hZHX7l.np69XxobcoDn.kOEvcuu6YSafmqgQ6q',
            role: 'ADMIN',
          })
        }
      })
      .catch()
  }

  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={t('title.adminUser')}
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
          name="username"
          label={t('title.username')}
          rules={[
            {
              required: true,
              message: `${t('message.check.username')}`,
            },
          ]}
        >
          <Input placeholder={t('message.placeholder.username')} />
        </Form.Item>
        <Form.Item
          name="nickname"
          label={t('title.nickname')}
          rules={[
            {
              required: true,
              message: `${t('message.check.nickname')}`,
            },
          ]}
        >
          <Input placeholder={t('message.placeholder.nickname')} />
        </Form.Item>
        <Form.Item name="email" label={t('title.email')}>
          <Input placeholder={t('message.placeholder.email')} />
        </Form.Item>
        <Form.Item name="phone" label={t('title.phone')}>
          <Input placeholder={t('message.placeholder.phone')} />
        </Form.Item>
        <Form.Item
          name="avatarImg"
          label={t('title.cover')}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e
            }
            return e?.fileList
          }}
        >
          <ImageListUpload domain={'DEFAULT'} maxCount={1} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
AdminUserForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default AdminUserForm
