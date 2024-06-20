// import DebounceSelect from '@/components/debounce-select'
import { Form, Input, Modal, Select, Radio, message, Button } from 'antd'
import ImageListUpload from '@/components/image-list-upload'
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
  const [displayUrl, setDisplayUrl] = useState();
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [url, setUrl] = useState('');
  const [jumpType, setJumpType] = useState('local');
  const [localType, setLocalType] = useState('product');
  const [localId, setLocalId] = useState(null);
  const [initVirtualCatOptions, setInitVirtualCatOptions] = useState([])
  const [initProductOptions, setInitProductOptions] = useState([])
  const localMap = {
    'product': { 
      app: 'StepBook://local/product',
      mini: '/pages/product/product-detail/product-detail',
    },
    'virtualCategory': { 
      app: 'StepBook://local/virtualCategory',
      mini: '/packageAudio/book-detail/index',
    },
  }

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

            // 假如链接当前没有配置，展示链接配置界面，有链接的情况下隐藏配置界面
            setDisplayUrl(resultData.actionUrl)
            setShowUrlForm(resultData.actionUrl ? false : true)
          }
        })
        .catch((err) => message.error(`load error:${err.message}`))
    } else {
      form.resetFields()
      setShowUrlForm(true)
      setDisplayUrl('')
      setLocalId(null)
    }
    if (visible) {
      fetchAllVirtualCategory().then(res => {
        setInitVirtualCatOptions(res)
      })
      fetchAllProduct().then(res => {
        setInitProductOptions(res)
      })
    }
  }, [id, form, visible])

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

  const buildLocalData = (type, id) => {
    let selectedLabel = '';
    const selectArr = type === 'product' ? initProductOptions : initVirtualCatOptions
    selectArr.some(item => {
      if(item.value == id){
        selectedLabel = item.label
        return true
      }else{
        return false
      }
    })
    return {
      appUrl: `${localMap[type].app}?id=${id}`,
      wxUrl: `${localMap[type].mini}?id=${id}`,
      selectedLabel
    }
  }

  const onUrlConfirm = () => {
    if(jumpType === 'local'){
      if(localId){
        const { appUrl, wxUrl, selectedLabel } = buildLocalData(localType, localId)
        form.setFieldsValue({
          actionUrl: appUrl,
          wxActionUrl: wxUrl,
          introduction: selectedLabel
        })
        setShowUrlForm(false);
        setDisplayUrl(appUrl);
      }else{
        message.error(t('pleaseSelect') + t(localType))
      }
    }else{
      if(!url){
        message.error(t('message.placeholder.url'))
      }else if(url.substring(0, 4) != 'http'){
        message.error(t('message.placeholder.collectHttpUrl'))
      }else{
        form.setFieldsValue({
          actionUrl: url,
          wxActionUrl: ''
        })
        setDisplayUrl(url);
        setShowUrlForm(false);
      }
    }
  }

  const fetchAllVirtualCategory = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/admin/v1/virtual-category?currentPage=1&pageSize=5000&includeChildren=false')
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data.records
            resolve(results.map(item => ({
              value: item.id,
              label: item.name
            })))
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const fetchAllProduct = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/admin/v1/products?currentPage=1&pageSize=5000&status=ON_SHELF')
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data.records
            resolve(results.map(item => ({
              value: item.id,
              label: item.skuName
            })))
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const handleLocalTypeChange = type => {
    setLocalType(type);
    setLocalId(null);
  }

  const LocalIdSelector = () => {
    const label = t('pleaseSelect') + t(localType)
    const options = localType === 'product' ? initProductOptions : initVirtualCatOptions
    return (
      <Select 
        placeholder={ label }
        style={{ width: '60%', marginLeft: '4%' }}
        value={localId}
        options={options}
        onChange={value => setLocalId(value)}
      />
    )
  }

  return (
    <Modal
      open={visible}
      width={720}
      style={{ maxHeight: 500 }}
      title={t('title.advertisingForm')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item name="wxActionUrl" style={{ display: 'none' }}>
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="actionUrl"
          label={t('title.label.url')}
          rules={[
            {
              required: true,
              message: `${t('message.placeholder.setJumpUrl')}`,
            },
          ]}
        >
          <div>
            <div style={{ position: 'relative' }}>
              <Input value={displayUrl} placeholder={t('message.placeholder.setUrlBelow')} disabled style={{ width: 'calc(100% - 80px)' }} />
              <Button style={{ position: 'absolute', top: 0, right: 0 }} type='primary' disabled={showUrlForm} onClick={() => setShowUrlForm(true)}>{t('button.edit')}</Button>
            </div>
            <div style={{ display: showUrlForm ? 'block' : 'none' }}>
              <div style={{ padding: '10px 15px', marginTop: '10px', background: '#f6f6f6' }}>
                <div>
                    <Radio.Group  onChange={ e => setJumpType(e.target.value) } value={jumpType}>
                      <Radio value='local'>{t('title.label.localJump')}</Radio>
                      <Radio value='link'>{t('title.label.urlJump')}</Radio>
                    </Radio.Group>
                </div>
                <div style={{ marginTop: '12px' }}>
                  {
                    jumpType === 'local'
                    ? <div>
                        <Select style={{ width: '35%' }} value={localType} placeholder={t('title.label.localServiceType')} onChange={value => handleLocalTypeChange(value)}>
                          <Option value="product">{t('title.label.jumpToProduct')}</Option>
                          <Option value="virtualCategory">{t('title.label.jumpToVirtualCat')}</Option>
                        </Select>
                        <LocalIdSelector />
                      </div>
                    : <Input value={url} placeholder={t('message.placeholder.url')} onInput={ event => setUrl(event.target.value) } />
                  }
                </div>
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <Button type='default' onClick={() => setShowUrlForm(false)} style={{ marginRight: '20px' }}>{t('button.cancel')}</Button>
                  <Button type='primary' onClick={() => onUrlConfirm()}>{t('button.determine')}</Button>
                </div>
              </div>
            </div>
          </div>
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
