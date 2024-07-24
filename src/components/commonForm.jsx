// 一个比较通用的表单编辑新增组件
// 当通用的edit-form无法拓展出建议的编辑新增界面时，
// 可以考虑采用该方案

import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { Form, Input, Modal, message, InputNumber, Radio, DatePicker } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const { RangePicker } = DatePicker;

const TaskForm = ({ 
  disabled = false,
  apiPath,
  visible,
  formData,
  onSave,
  onCancel
}) => {
  const dateFormat = 'YYYY-MM-DD'
  const width = 640
  const labelSpan = 5
  const title = 'pointTask'
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const isAdd = formData && formData.id ? false : true
  const url = `/api/admin/v1/${apiPath}` + (isAdd ? '' : `/${formData.id}`)
  const method = isAdd ? 'post' : 'put'
  const showTitle = t(title) + t('CONNECT_MARK1') + t(disabled ? 'view' : (isAdd ? 'button.create' : 'button.edit'))
  const [datePickerShow, setDatePickerShow] = useState(formData.type === 'SPECIAL')
  let initValues = {
    ...formData
  }

  // 编辑显示的模式下，在下一个 event loop 对表单进行重置 
  useEffect(() => {
    let dateRange = null;
    if(formData.startDate){
      dateRange = [dayjs(formData.startDate), dayjs(formData.endDate)]
    }
    form.setFieldsValue({
      ...formData,
      dateRange
    })
  })


  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const saveData = () => {
    form.validateFields().then(values => {
      const [startDate, endDate] = values.type === 'SPECIAL' ? [
        values.dateRange[0].format(dateFormat),
        values.dateRange[1].format(dateFormat),
      ] : [null, null]
      const data = {
        ...values,
        startDate,
        endDate,
        dateRange: null
      }
      axios.request({
        url,
        method,
        data
      }).then((res) => {
        if (res.status === HttpStatus.OK) {
          onSave()
        }else{
          message.error(`save data failed, reason:${res.message}`)
        }
      }).catch(() => {
        message.error(`save data failed, server error`)
      })
    }).catch((err) => {
      console.log(err)
      message.error('请完善表单信息')
    })
  }

  return (
    <Modal
      open={visible}
      width={width}
      title={showTitle}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={handleCancel}
      onOk={saveData}
      footer={ disabled ? null : undefined }
    >
      <Form
        labelCol={{ span: labelSpan }}
        layout="horizontal"
        form={form}
        initialValues={initValues}
        name="form_in_modal"
        disabled={ disabled }
      >
        <Form.Item name='name' label={t('name')}>
          <Input type="text" placeholder={t('pleaseEnter') + t('name')} />
        </Form.Item>
        <Form.Item name='type' label={t('taskType')}>
          <Radio.Group options={[
            { value: 'DAILY', label: t('dailyTask') },
            { value: 'SPECIAL', label: t('specialTask') },
          ]} onChange={e => setDatePickerShow(e.target.value === 'SPECIAL')} />
        </Form.Item>
        {
          datePickerShow ?
          <Form.Item name='dateRange' label={t('startEndDate')}>
            <RangePicker />
          </Form.Item>
          : null
        }
        <Form.Item name='actionUrl' label={t('taskUrl')}>
          <Input type="text" placeholder={t('pleaseEnter') + t('taskUrl')} />
        </Form.Item>
        <Form.Item name='points' label={t('point')}>
          <InputNumber style={{ width: 200 }} min={1} max={999999} prefix={1} />
        </Form.Item>
        <Form.Item name='successHint' label={t('successHint')}>
          <TextArea placeholder={t('pleaseEnter') + t('successHint')} />
        </Form.Item>
      </Form>
    </Modal>
  )
}


TaskForm.propTypes = {
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  apiPath: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  labelSpan: PropTypes.number,
  domain: PropTypes.string,
  permission: PropTypes.string,
  formData: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default TaskForm