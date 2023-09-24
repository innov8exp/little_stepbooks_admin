import { DatePicker, Form, Input, message, Modal, Select } from 'antd'
import axios from 'axios'
import DebounceSelect from '@/components/debounce-select'
import HttpStatus from 'http-status-codes'
import moment from 'moment'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const { Option } = Select

function disabledDate(current) {
  return current && current < moment().endOf('day')
}
const PromotionForm = ({ id, visible, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const [promotionType, setPromotionType] = useState()

  const fetchBook = async (value) => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/api/admin/v1/books/search?bookName=${value}&currentPage=1&pageSize=10`
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
          message.success('操作成功!')
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
          message.success('操作成功!')
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
      title='促销表单'
      okText='保存'
      cancelText='取消'
      onCancel={onCancel}
      onOk={okHandler}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout='horizontal'
        form={form}
        name='form_in_modal'>
        <Form.Item name='bookId' hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name='bookName'
          label='书籍'
          rules={[
            {
              required: true,
              message: '请选择书籍',
            },
          ]}>
          <DebounceSelect
            showSearch
            fetchOptions={fetchBook}
            placeholder='请输入书籍名称搜索'
            onChange={(option) => handleSelectChangeAction(option)}
          />
        </Form.Item>
        <Form.Item
          name='promotionType'
          label='促销类型'
          rules={[
            {
              required: true,
              message: '请选择促销类型',
            },
          ]}>
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
            }}>
            <Option value='LIMIT_FREE'>限时免费</Option>
            <Option value='LIMIT_DISCOUNT'>限时折扣</Option>
          </Select>
        </Form.Item>
        <Form.Item name='originalCoinAmount' label='章节原价（书币）'>
          <Input type='number' readOnly />
        </Form.Item>
        <Form.Item
          name='discountPercent'
          label='折扣%'
          rules={[
            {
              required: true,
              message: '请输入折扣%',
            },
          ]}>
          <Input
            type='number'
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
        <Form.Item name='coinAmount' label='折扣后章节单价（书币）'>
          <Input type='number' readOnly />
        </Form.Item>
        <Form.Item
          name='timeRange'
          label='促销时间'
          rules={[
            {
              required: true,
              message: '请选择促销时间',
            },
          ]}>
          <DatePicker.RangePicker
            disabledDate={disabledDate}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [
                moment('00:00:00', 'HH:mm:ss'),
                moment('11:59:59', 'HH:mm:ss'),
              ],
            }}
            format='YYYY-MM-DD HH:mm:ss'
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
