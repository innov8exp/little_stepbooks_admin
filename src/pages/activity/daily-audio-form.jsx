import { Form, Modal, Select, DatePicker, message, Input } from 'antd'
import dayjs from 'dayjs';
import http from '@/libs/http'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    SearchOutlined
} from '@ant-design/icons'


const DailyAudioForm = ({ editData, visible, endCats, onSave, onCancel }) => {
  const dateFormat = 'YYYY-MM-DD'
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [catOptions, setCatOptions] = useState(endCats || []);
//   const [goodsOptions, setGoodsOptions] = useState([]);
  const [audioOptions, setAudioOptions] = useState([]);

  useEffect(() => {
    setCatOptions(endCats)
  }, [endCats])

  useEffect(() => {
    if(visible){
        if (editData.id) {
            const newData = {
                ...editData,
                day: dayjs(editData.day, dateFormat)
            }
            setAudioOptions([{
                id: editData.audioId,
                name: editData.fullName.split('->').pop()
            }])
            form.setFieldsValue(newData)
        }else{
            form.resetFields()
        }
    }
  }, [editData, form, visible])

  const handleSearch = (newValue) => {
    const value = newValue.trim().toLocaleLowerCase();
    if(!value){
        setCatOptions([])
    }else{
        setCatOptions(endCats.filter(item => item.name.toLocaleLowerCase().includes(value)))
    }
  };

  const handleCatChange = (value) => {
    queryAudioData(value);
    form.setFieldsValue({
        goodsId: null,
        audioId: null
    })
  }

  const handleAudioChange = (value) => {
    audioOptions.some(item => {
        if(item.id === value){
            form.setFieldValue({
                goodsId: item.goodsId
            })
            return true
        }else{
            return false
        }
    })
  };

  const queryAudioData = (categoryId) => {
    http.get(`/virtual-goods-audio?categoryId=${categoryId}&currentPage=1&pageSize=1000`).then(res => {
        setAudioOptions(res.records)
    })
  }

  const okHandler = () => {
    form.validateFields().then((values) => {
        const { categoryId, goodsId, audioId, day } = values
        const params = {
            categoryId, goodsId, audioId,
            day: day.format(dateFormat)
        };
        if(editData.id){
            params.id = editData.id
        }
        http.put('/daily-audio/set', params).then(() => {
            onSave()
        })
      }).catch(err => message.error(err))
  }

  return (
    <Modal
      open={visible}
      width={640}
      title={t('dailyAudioForm')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item name="categoryId" label={t('virtualGoodsCat')} rules={[{
            required: true,
            message: t('pleaseSelect') + t('virtualGoodsCat')
        }]}>
            <Select
                showSearch
                placeholder={t('pleaseSelect')}
                defaultActiveFirstOption={false}
                suffixIcon={<SearchOutlined />}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleCatChange}
                notFoundContent={null}
                options={(catOptions || []).map((d) => ({
                    value: d.id,
                    label: d.name,
                }))}
            />
        </Form.Item>
        <Form.Item name="goodsId" hidden>
            <Input />
        </Form.Item>
        <Form.Item name="audioId" label={t('audio')} rules={[{
            required: true,
            message: t('pleaseSelect') + t('audio')
        }]}>
            <Select
                onChange={handleAudioChange}
                placeholder={t('pleaseSelect')}
                options={audioOptions.map((d) => ({
                    value: d.id,
                    label: d.name
                }))}
            />
        </Form.Item>
        <Form.Item name="day" label={t('startDate')} rules={[{
            required: true,
            message: t('pleaseSelect') + t('startDate')
        }]}>
            <DatePicker disabled={ !!editData.id } />
        </Form.Item>
      </Form>
    </Modal>
  )
}
DailyAudioForm.propTypes = {
  editData: PropTypes.object,
  endCats: PropTypes.array,
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default DailyAudioForm
