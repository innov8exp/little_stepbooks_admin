import DebounceSelect from '@/components/debounce-select'
import ImageListUpload from '@/components/image-list-upload'
import { Form, Input, Modal, Select, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const AdvertisementForm = ({ id, visible, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [initBookOptions, setInitBookOptions] = useState([])

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/advertisements/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const resultData = res.data
            const adsImgArr = []
            if (resultData.adsImgId) {
              adsImgArr.push({
                id: resultData.adsImgId,
                name: resultData.adsImgUrl?.split('/')?.pop(),
                url: resultData.adsImgUrl,
                response: {
                  id: resultData.adsImgId,
                  objectUrl: resultData.adsImgUrl,
                },
              })
            }
            form.setFieldsValue({
              ...res.data,
              adsImg: adsImgArr,
            })
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    } else {
      form.resetFields()
    }
  }, [id, form])

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/advertisements`, {
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
      .put(`/api/admin/v1/advertisements/${id}`, {
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
            adsImgId: values.adsImg?.[0]?.response?.id,
            adsImgUrl: values.adsImg?.[0]?.response?.objectUrl,
          })
        } else {
          createData({
            ...values,
            adsImgId: values.adsImg?.[0]?.response?.id,
            adsImgUrl: values.adsImg?.[0]?.response?.objectUrl,
          })
        }
      })
      .catch()
  }

  const handleSelectChangeAction = (optionValue) => {
    form.setFieldsValue({
      bookId: optionValue,
    })
  }

  const fetchProduct = async (value) => {
    return new Promise((resolve, reject) => {
      let url = `/api/admin/v1/products?status=ON_SHELF&skuName=${value}&currentPage=1&pageSize=10`
      if (!value) {
        url = `/api/admin/v1/products?status=ON_SHELF&currentPage=1&pageSize=10`
      }
      axios
        .get(url)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const products = results.records
            const options = products.map((item) => ({
              value: item.id,
              label: item.skuName,
            }))
            resolve(options)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  useEffect(() => {
    if (visible) {
      fetchProduct().then((res) => {
        setInitBookOptions(res)
      })
    }
  }, [visible])
  return (
    <Modal
      open={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title={t('title.advertisingForm')}
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
          name="productId"
          label={t('title.label.product')}
          rules={[
            {
              required: true,
              message: `${t('message.check.selectProduct')}`,
            },
          ]}
        >
          <DebounceSelect
            showSearch
            initOptions={initBookOptions}
            fetchOptions={fetchProduct}
            placeholder={t('message.placeholder.enterProductSearch')}
            onChange={({ value }) => handleSelectChangeAction(value)}
          />
        </Form.Item>
        <Form.Item
          name="adsType"
          label={t('title.adType')}
          rules={[
            {
              required: true,
              message: `${t('message.check.selectAdvertisingType')}`,
            },
          ]}
        >
          <Select placeholder={t('message.check.selectAdvertisingType')}>
            <Option value="CAROUSEL">{t('radio.label.CAROUSEL')}</Option>
            <Option value="RECOMMEND">{t('radio.label.RECOMMEND')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="adsImg"
          label={t('title.cover')}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e
            }
            return e?.fileList
          }}
        >
          <ImageListUpload domain={'ADVERTISEMENT'} maxCount={1} />
        </Form.Item>
        <Form.Item name="introduction" label={t('title.briefIntroduction')}>
          <TextArea
            rows={3}
            style={{ resize: 'none' }}
            placeholder={t('message.placeholder.briefIntroduction')}
          />
        </Form.Item>
        <Form.Item name="sortIndex" label={t('title.ORDER')}>
          <Input type="number" placeholder={t('message.placeholder.ORDER')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
AdvertisementForm.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default AdvertisementForm
