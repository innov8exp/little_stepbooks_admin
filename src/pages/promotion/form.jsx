import { DatePicker, Form, Input, message, Modal, Select } from 'antd'
import axios from 'axios'
import DebounceSelect from '@/components/debounce-select'
import HttpStatus from 'http-status-codes'
import moment from 'moment'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const { Option } = Select

function disabledDate(current) {
  return current && current < moment().endOf('day')
}
const PromotionForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [promotionType, setPromotionType] = useState()

  const fetchBook = async (value) => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/api/admin/v1/books/search?bookName=${value}&currentPage=1&pageSize=10`,
        )
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const books = results.records
            const options = books.map((item) => ({
              label: item.bookName,
              value: [item.id, item.price],
            }))
            resolve(options)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const handleSelectChangeAction = (optionValue) => {
    console.log(optionValue)
    form.setFieldsValue({
      bookId: optionValue.value[0],
      originalCoinAmount: optionValue.value[1],
    })
    const discountPercent = form.getFieldValue('discountPercent')
    if (!Number.isNaN(discountPercent)) {
      form.setFieldsValue({
        coinAmount: ((discountPercent / 100) * optionValue.value[1]).toFixed(1),
      })
    }
  }

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/promotions/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({
              ...res.data,
              timeRange: [moment(res.data.limitFrom), moment(res.data.limitTo)],
              bookName: {
                label: res.data.bookName,
                value: res.data.bookId,
              },
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    }
  }, [id, form, visible])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/promotions`, {
        ...values,
        limitFrom: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
        limitTo: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
        bookName: '',
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
      .put(`/api/admin/v1/promotions/${id}`, {
        ...values,
        limitFrom: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
        limitTo: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
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
  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={t('title.label.promotionForm')}
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
            onChange={(option) => handleSelectChangeAction(option)}
          />
        </Form.Item>
        <Form.Item
          name="promotionType"
          label={t('title.label.promotionType')}
          rules={[
            {
              required: true,
              message: `${t('message.check.selectPromotionType')}`,
            },
          ]}
        >
          <Select
            onChange={(value) => {
              setPromotionType(value)
              if (value === 'LIMIT_FREE') {
                form.setFieldsValue({
                  discountPercent: 0,
                  coinAmount: 0,
                })
              } else {
                form.setFieldsValue({ discountPercent: '' })
              }
            }}
            placeholder={t('message.check.selectPromotionType')}
          >
            <Option value="LIMIT_FREE">
              {t('title.label.limitedTimeFree')}
            </Option>
            <Option value="LIMIT_DISCOUNT">
              {' '}
              {t('title.label.LimitedTimeDiscount')}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="originalCoinAmount"
          label={t('title.label.chapterOriginalPrice')}
        >
          <Input type="number" readOnly />
        </Form.Item>
        <Form.Item
          name="discountPercent"
          label={t('title.label.discount')}
          rules={[
            {
              required: true,
              message: `${t('message.check.enterDiscount')}`,
            },
          ]}
        >
          <Input
            type="number"
            readOnly={promotionType === 'LIMIT_FREE'}
            onChange={() => {
              const value = form.getFieldValue('discountPercent')
              const originalCoinAmount =
                form.getFieldValue('originalCoinAmount')
              form.setFieldsValue({
                coinAmount: ((value / 100) * originalCoinAmount).toFixed(1),
              })
            }}
          />
        </Form.Item>
        <Form.Item name="coinAmount" label={t('title.label.chapterUnitPrice')}>
          <Input type="number" readOnly />
        </Form.Item>
        <Form.Item
          name="timeRange"
          label={t('title.label.salesTime')}
          rules={[
            {
              required: true,
              message: `${t('message.check.selectPromotionTime')}`,
            },
          ]}
        >
          <DatePicker.RangePicker
            disabledDate={disabledDate}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss'),
              ],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

PromotionForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default PromotionForm
