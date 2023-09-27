import { Form, Input, message, Modal, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import DebounceSelect from '@/components/debounce-select'
import HttpStatus from 'http-status-codes'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const { Option } = Select
const RecommendForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/recommends/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({
              ...res.data,
              bookName: {
                label: res.data.bookName,
                value: res.data.bookId,
              },
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form])

  const fetchBook = async (value) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/admin/v1/books?bookName=${value}&currentPage=1&pageSize=10`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const books = results.records
            const options = books.map((item) => ({
              label: item.bookName,
              value: item.id,
            }))
            resolve(options)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/recommends`, {
        ...values,
        bookName: values.label,
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
      .put(`/api/admin/v1/recommends/${id}`, {
        ...values,
        bookName: values.label,
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
          updateData(values)
        } else {
          createData(values)
        }
      })
      .catch()
  }

  const handleSelectChangeAction = (optionValue) => {
    form.setFieldsValue({
      bookId: optionValue,
    })
  }

  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={t('title.homepageRecommendation')}
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
        <Form.Item name="bookId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="bookName"
          label={t('title.label.books')}
          rules={[
            {
              required: true,
              message: `${t('message.check.selectBook')}`,
            },
          ]}
        >
          <DebounceSelect
            showSearch
            fetchOptions={fetchBook}
            placeholder={t('message.placeholder.enterBookSearch')}
            onChange={({ value }) => handleSelectChangeAction(value)}
          />
        </Form.Item>
        <Form.Item name="recommendType" label={t('title.recommendType')}>
          <Select placeholder={t('message.placeholder.recommendType')}>
            <Option value="TODAY">
              {t('select.option.TodayRecommendation')}
            </Option>
            <Option value="TOP_SEARCH">
              {t('select.option.hotSearchRecommendations')}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name="introduction" label={t('title.briefIntroduction')}>
          <TextArea
            rows={3}
            style={{ resize: 'none' }}
            placeholder={t('message.placeholder.briefIntroduction')}
            maxLength={300}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

RecommendForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default RecommendForm
