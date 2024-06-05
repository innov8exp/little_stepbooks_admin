import { Col, Row, Modal, Select, Radio, message } from 'antd'
import http from '@/libs/http'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    SearchOutlined
  } from '@ant-design/icons'


const CatRelativeForm = ({ currentData, visible, onSave, onCancel }) => {
  const currentProduct = currentData || {}
  const { t } = useTranslation()
  const [productId, setProductId] = useState(currentProduct.id || null);
  const [displayTime, setDisplayTime] = useState(currentProduct.displayTime || 'ONLY_UNPURCHASED');
  const [selectOptions, setSelectOptions] = useState(currentProduct.id ? [currentProduct] : []);
  const handleSearch = (newValue) => {
    let url = '/products?currentPage=1&pageSize=10'
    const value = newValue.trim();
    if(!value){
        setSelectOptions([])
    }else{
        url += `&skuName=${encodeURIComponent(value)}`
        http.get(url).then(res => {
            setSelectOptions(res.records)
        }).catch(() => {
            setSelectOptions([])
        })
    }
  };

  const onDisplayTimeChange = (e) => {
    setDisplayTime(e.target.value)
  }

  const handleChange = (newValue) => {
    setProductId(newValue);
  };


  const okHandler = () => {
    if(productId){
        http.put('/virtual-category-product/set', {
            categoryId: currentData.categoryId,
            productId,
            displayTime
        }).then(onSave)
    }else{
        message.error(t('message.check.selectProduct'))
    }
  }

  return (
    <Modal
      open={visible}
      width={640}
      title={`${currentData.categoryName} —— ${t('relativeProduct')}`}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
    >
        <Row style={{ paddingTop: 30 }}>
            <Col span={4} style={{ textAlign: 'right', paddingRight: 10 }}>{t('product')}: </Col>
            <Col span={16}>
                <Select
                    showSearch
                    value={productId}
                    style={{ width: '100%' }}
                    placeholder={t('message.check.selectProduct')}
                    defaultActiveFirstOption={false}
                    suffixIcon={<SearchOutlined />}
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    notFoundContent={null}
                    options={(selectOptions || []).map((d) => ({
                        value: d.id,
                        label: d.skuName,
                    }))}
                />
            </Col>
        </Row>
        <Row style={{ paddingTop: 30 }}>
            <Col span={4} style={{ textAlign: 'right', paddingRight: 10 }}>{t('displayTime')}: </Col>
            <Col span={16}>
                <Radio.Group onChange={onDisplayTimeChange} value={displayTime}>
                    <Radio value={'ONLY_UNPURCHASED'}>{t('displayAtNotPay')}</Radio>
                    <Radio value={'ALWAYS'}>{t('displayAlways')}</Radio>
                </Radio.Group>
            </Col>
        </Row>
    </Modal>
  )
}
CatRelativeForm.propTypes = {
  currentData: PropTypes.object,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default CatRelativeForm
