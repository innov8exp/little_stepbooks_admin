import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { Form, Card, message, InputNumber, Radio, Button, DatePicker } from 'antd'
import http from '@/libs/http'
import { useTranslation } from 'react-i18next'
import SearchSelect from '@/components/SearchSelect'

const { RangePicker } = DatePicker;

const PointSettingPage = () => {
  const dateFormat = 'YYYY-MM-DD'
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [festivalEnable, setFestivalEnable] = useState(false)
  const [promotionEnable, setPromotionEnable] = useState(false)
  const [fullPromotion, setFullPromotion] = useState(false)
  const [current, setCurrent] = useState(null)
  const [currentProducts, setCurrentProducts] = useState([]);
  const [spuIdArr, setSpuIdArr] = useState([]);

  useEffect(() => {
    if(!current){
      http.get('points-rule/full').then(data => {
        const fullPromotion = !data.spuIds;
        setCurrent(data)
        setFestivalEnable(data.specialCheckIn)
        setPromotionEnable(data.pointsPromotion)
        setFullPromotion(fullPromotion)
        if(data.specialCheckIn){
          data.specialDateRange = [dayjs(data.activityStartDay), dayjs(data.activityEndDay)]
        }
        if(data.pointsPromotion){
          data.promotionDateRange = [dayjs(data.promotionStartDay), dayjs(data.promotionEndDay)]
          if(data.spus && data.spus.length > 0){
            setCurrentProducts(data.spus.map(item => ({
              value: item.id,
              label: item.skuName
            })))
            setSpuIdArr(data.spuIds.split(','))
          }
        }
        form.setFieldsValue({
          ...data,
          fullPromotion
        })
        console.log(data)
      })
    }
  })

  async function fetchProductList(name) {
    return http.get(`products?currentPage=1&pageSize=10&skuName=${name}`).then(data => {
      return data.records.map(item => ({
        value: item.id,
        label: item.skuName
      }))
    })
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      const {
        dailyCheckInPoints,
        threeDayCheckInPoints,
        sevenDayCheckInPoints,
        specialCheckIn,
        specialCheckInPoints,
        pointsPerYuanNormal,
        pointsPromotion,
      } = values;
      const data = {
        dailyCheckInPoints,
        threeDayCheckInPoints,
        sevenDayCheckInPoints,
        specialCheckIn,
        specialCheckInPoints,
        pointsPerYuanNormal,
        pointsPromotion,
      }
      if(values.specialCheckIn){
        data.activityStartDay = values.specialDateRange[0].format(dateFormat)
        data.activityEndDay = values.specialDateRange[1].format(dateFormat)
        data.specialCheckInPoints = values.specialCheckInPoints
      }else{ // 若是不启用，采用历史配置的值填充
        data.activityStartDay = current.activityStartDay
        data.activityEndDay = current.activityEndDay
        data.specialCheckInPoints = 0
      }
      if(values.pointsPromotion){
        data.promotionStartDay = values.promotionDateRange[0].format(dateFormat)
        data.promotionEndDay = values.promotionDateRange[1].format(dateFormat)
        data.pointsPerYuanPromotion = values.pointsPerYuanPromotion
        if(fullPromotion){
          data.spuIds = "*"
        }else{
          data.spuIds = spuIdArr.join(',')
        }
      }else{
        data.promotionStartDay = current.promotionStartDay
        data.promotionEndDay = current.promotionEndDay
        data.spuIds = "*"
      }
      http.put('points-rule/set', data).then(() => {
        message.success(t('saveSuccess'))
      })
    }).catch((err) => {
      console.log(err)
      message.error('请完善表单信息')
    })
  }

  return (
    <Card title={t('pointSetting')}>
      <Form
        labelCol={{ span: 8 }}
        layout="horizontal"
        form={form}
        name="setting_form"
      >
        <Form.Item name='dailyCheckInPoints' label={t('dailySignInPoints')}>
          <InputNumber min={1} max={100} defaultValue={1} />
        </Form.Item>
        <Form.Item name='threeDayCheckInPoints' label={t('3DaysSignInPoints')}>
          <InputNumber min={1} max={300} defaultValue={2} />
        </Form.Item>
        <Form.Item name='sevenDayCheckInPoints' label={t('7DaysSignInPoints')}>
          <InputNumber min={1} max={700} defaultValue={3} />
        </Form.Item>
        <Form.Item name='specialCheckIn' label={t('multiplePointsForFestival')}>
            <Radio.Group options={[
              { value: true, label: t('enable') },
              { value: false, label: t('disable') },
            ]} onChange={e => setFestivalEnable(e.target.value)} />
        </Form.Item>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px 0', margin: '-20px 0 24px', display: festivalEnable ? 'block' : 'none' }}>
          <Form.Item name='specialCheckInPoints' label={t('festivalSignInPoints')}>
            <InputNumber min={1} max={100} defaultValue={2} />
          </Form.Item>
          <Form.Item name='specialDateRange' label={t('startEndDate')} style={{ marginBottom: 0 }}>
            <RangePicker />
          </Form.Item>
        </div>
        <Form.Item name='pointsPerYuanNormal' label={t('pointsPerYuanNormal')}>
          <InputNumber min={1} max={100} defaultValue={1} />
        </Form.Item>
        <Form.Item name='pointsPromotion' label={t('pointsPromotion')}>
            <Radio.Group options={[
              { value: true, label: t('enable') },
              { value: false, label: t('disable') },
            ]} onChange={e => setPromotionEnable(e.target.value)} />
        </Form.Item>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px 0', margin: '-20px 0 24px', display: promotionEnable ? 'block' : 'none' }}>
          <Form.Item name='promotionDateRange' label={t('startEndDate')}>
              <RangePicker />
          </Form.Item>
          <Form.Item name='pointsPerYuanPromotion' label={t('pointsPerYuanPromotion')}>
            <InputNumber min={1} max={200} defaultValue={2} disabled={!promotionEnable} />
          </Form.Item>
          <Form.Item name='fullPromotion' label={t('promotionScope')}>
              <Radio.Group options={[
                { value: true, label: t('fullPromotion') },
                { value: false, label: t('promotionOnSelectedGoods') },
              ]} onChange={e => setFullPromotion(e.target.value)} />
          </Form.Item>
          <Form.Item name='spuIdArr' label={t('selectPromotionGoods')} style={{ marginBottom: 0, display: fullPromotion ? 'none' : 'block' }}>
            <SearchSelect
              mode="multiple"
              value={spuIdArr}
              placeholder={t('pleaseSelect')}
              initOptions={currentProducts}
              fetchOptions={fetchProductList}
              onChange={(newValue) => {
                setSpuIdArr(newValue.map(item => item.value));
              }}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </div>
        <Form.Item wrapperCol={{
          offset: 8,
          span: 16,
        }}>
          <Button type="primary" onClick={handleSave}>
            {t('button.save')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PointSettingPage