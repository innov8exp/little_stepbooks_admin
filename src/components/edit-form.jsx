
import { useState, useEffect } from 'react'
import { Form, Input, Modal, message, Select, InputNumber, Checkbox, Switch, Radio, DatePicker } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import http from '@/libs/http'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ImageUpload from './image-upload'
import ImagesUpload from './images-upload'
import FileUpload from './file-upload'
// import debounce from 'lodash/debounce';

const { RangePicker } = DatePicker;

const labelMap = {
  title: 'title',
  name: 'name',
  skuName: 'name',
  description: 'description',
  coverUrl: 'coverImage',
  detailUrl: 'detailImage',
  audioUrl: 'audio',
  videoUrl: 'video',
  sortIndex: 'sortNumber',
  tags: 'tags',
}

const placeholderMap = {
  title: 'message.check.title',
  name: 'message.check.name',
  skuName: 'message.check.name',
  description: 'message.check.desc',
}

const itemPropTypes = {
  addOnly: PropTypes.bool, // 只有新增时才允许配置该字段
  editOnly: PropTypes.bool, // 只有编辑时才允许配置该字段
  disabled: PropTypes.bool, // 可展示，不允许编辑
  hidden: PropTypes.bool, // 是否隐藏
  type: PropTypes.string,
  selectorType: PropTypes.string, // 选择系统的产品类别，Product | virtualType
  placeholder: PropTypes.string,
  checkedLabel: PropTypes.string,
  unCheckedLabel: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  key: PropTypes.string,
  prefix: PropTypes.string,
  groupKeys: PropTypes.array,
  options: PropTypes.array,
  mode: PropTypes.string,
  format: PropTypes.func,
  rules: PropTypes.array,
  required: PropTypes.bool
}

const EditForm = ({ 
  disabled = false,
  visible,
  formData,
  title = 'FORM',
  width = 640,
  labelSpan = 5,
  domain,
  permission,
  apiPath,
  formKeys = [],
  appendData = null,
  saveDataFormat = null,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [productOptions, setProductOptions] = useState([])
  const [virtualTypeOptions, setVirtualTypeOptions] = useState([])
  const isAdd = formData && formData.id ? false : true
  const url = `/api/admin/v1/${apiPath}` + (isAdd ? '' : `/${formData.id}`)
  const method = isAdd ? 'post' : 'put'
  const showTitle = t(title) + t('CONNECT_MARK1') + t(disabled ? 'view' : (isAdd ? 'button.create' : 'button.edit'))
  const getHiddenMap = function(){
    const hideMap = {};
    formKeys.forEach(item => {
      if(item.hiddenControl){
        hideMap[item.key] = item.hiddenControl.handler(formData[item.hiddenControl.key])
      }else{
        hideMap[item.key] = false;
      }
    })
    return hideMap
  }
  const [hiddenMap, setHiddenMap] = useState(getHiddenMap())

  const onItemChange = (key, value) => {
    let newMap = { ...hiddenMap }
    formKeys.forEach(item => {
      if(item.hiddenControl && item.hiddenControl.key === key){
        newMap[item.key] = item.hiddenControl.handler(value)
      }
    })
    setHiddenMap(newMap)
  }

  // const doProductSearch = (value) => {
  //   http.get(`products?currentPage=1&pageSize=10&skuName=${value}`).then(data => {
  //     const arr = data.records.map(item => ({
  //       value: item.id,
  //       label: item.skuName
  //     }))
  //     setProductOptions(arr)
  //   })
  // }

  // const onDebounceProductSearch = debounce(doProductSearch, 800)

  const realFormKeys = formKeys.filter(item => {
    if(item.key === 'sortIndex' && isAdd){ // 如果是新增行为，忽略排序字段的传参以及配置
      return false
    }
    if(item.addOnly && !isAdd){
      return false
    }
    if(item.editOnly && isAdd){
      return false
    }
    return true
  });
  

  // 存在一些冗余的字段需要独立维护，通过 hiddenData 对象进行维护
  // 视频、音频、图片资源需要追加对应的 id 字段， 视频、音频保持追加 duration 字段
  // check 表单同时维护id、name
  const hiddenFormData = {};
  realFormKeys.forEach(item => {
    item.groupKeys && item.groupKeys.forEach(key => {
      hiddenFormData[key] = formData[key]
    })
  })

  // 显示隐藏过程中对表单进行重置
  useEffect(() => {
    if(visible){
      form.setFieldsValue({
        ...formData
      })
      setHiddenMap(getHiddenMap())
    }else{
      form.resetFields()
    }
    if(visible){
      formKeys.forEach(item => {
        if(item.selectorType === 'virtualCategory'){
          const url = `virtual-category/all-endpoints`
          http.get(url).then(data => {
              setVirtualTypeOptions(data.map(item => ({ 
                value: item.id,
                label: item.parent ? `${item.parent.name} - ${item.name}` : item.name
              })))
          })
        }else if(item.selectorType === 'product'){
          const url = `products?currentPage=1&pageSize=500`
          http.get(url).then(data => {
            setProductOptions(data.records.map(item => ({ 
              value: item.id,
              label: item.skuName
            })))
          })
        }
      })
    }
  }, [visible])

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const saveData = () => {
    form.validateFields().then(values => {
      realFormKeys.forEach(item => {
        if(item.format){ // 假如传递的某一个参数项存在数值的format函数，需要对其表单传递的值进行转换
          values[item.key] = item.format(values[item.key])
        }
      })
      let data = Object.assign(values, hiddenFormData, appendData)
      if(saveDataFormat){
        data = saveDataFormat(data)
      }
      axios.request({
        url,
        method,
        data
      }).then((res) => {
        if (res.status === HttpStatus.OK) {
          onSave(data)
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

  const BuildFormItemInput = ({
    type,
    placeholder,
    min,
    max,
    key,
    groupKeys,
    options,
    mode,
    maxCount,
    prefix,
    checkedLabel,
    unCheckedLabel,
    disabled,
    selectorType
  }) => {
    placeholder =  t(placeholder || placeholderMap[key] || key)
    // debounce(loadOptions, debounceTimeout);
    // const onDebounceSearch = onSearch ? debounce(onSearch, 800) : function () {}
    if(type === 'input' || type === 'hidden'){
      return (<Input type="text" placeholder={placeholder} disabled={ disabled } />)
    }
    if(type === 'textarea'){
      return (<TextArea placeholder={placeholder} disabled={ disabled } />)
    }
    if(type === 'number'){
      return (<InputNumber style={{ width: 200 }} min={min} max={max} prefix={prefix} disabled={ disabled } />)
    }
    if(type === 'dateRangePicker'){
      return <RangePicker disabled={ disabled } />
    }
    if(type === 'boolean'){
      return (
        <Switch
          checkedChildren={t(checkedLabel)}
          unCheckedChildren={t(unCheckedLabel)}
          style={{ width: 100 }}
          disabled={ disabled }
          onChange={ value => onItemChange(key, value) }
        />
      )
    }
    if(type === 'photo'){
      return (<ImageUpload domain={domain} permission={permission} value={formData[key]} disabled={ disabled } onChange={res => {
        form.setFieldValue(key, res.url)
        if(groupKeys) {
          Object.assign(hiddenFormData, {
            [groupKeys[0]]: res.id
          })
        }
      }} />)
    }
    if(type === 'photo-list'){
      return (<ImagesUpload domain={domain} permission={permission} value={formData[key]} maxCount={maxCount} disabled={ disabled } onChange={res => {
        form.setFieldValue(key, res)
      }} />)
    }
    if(type === 'select'){
      if(selectorType === 'product'){
        return <Select key={key} placeholder={t('pleaseSelectProduct')} mode={mode} options={productOptions} disabled={ disabled } />
      }else if(selectorType === 'virtualCategory'){
        return <Select key={key} placeholder={t('pleaseSelectVirtualType')} mode={mode} options={virtualTypeOptions} disabled={ disabled } />
      }else{
        return <Select key={key} placeholder={placeholder} mode={mode} options={options} disabled={ disabled } />
      }
    }
    if(type === 'checkbox'){
      return (
        <Checkbox disabled={ disabled }></Checkbox>
      )
    }
    if(type === 'checkbox.group'){
      return (
        <Checkbox.Group options={options} disabled={ disabled } onChange={valueArr => {
          form.setFieldValue(key, valueArr)
          if(groupKeys) {
            const arr = [];
            const optionMap = {};
            options.forEach(option => {
              optionMap[option.value] = option.name
            })
            valueArr && valueArr.forEach(val => {
              arr.push(optionMap[val])
            })
            Object.assign(hiddenFormData, {
              [groupKeys[0]]: arr
            })
          }
          onItemChange(key, valueArr)
        }} />
      )
    }
    if(type === 'radio.group'){
      return (
        <Radio.Group disabled={ disabled } options={options.map(item => ({
          ...item,
          label: t(item.label)
        }))} onChange={ e => onItemChange(key, e.target.value) } />
      )
    }
    if(type === 'audio' || type === 'video'){
      const accept = type === 'audio' ? '.mp3,.m4a' : '.mp4'
      return (<FileUpload domain={domain} permission={permission} fileUrl={formData[key]} accept={accept} isMedia={true} disabled={ disabled } onChange={res => {
        form.setFieldValue(key, res.url)
        if(groupKeys){
          const newData = {}
          groupKeys.forEach(gKey => {
            newData[gKey] = gKey === 'duration' ? res.duration : res.id
          })
          Object.assign(hiddenFormData, newData)
        }
      }} />)
    }
    if(type === 'file'){
      return (<FileUpload domain={domain} permission={permission} fileUrl={formData[key]} disabled={ disabled } onChange={res => {
        form.setFieldValue(key, res.url)
        if(groupKeys){
          Object.assign(hiddenFormData, {
            [groupKeys[0]]: res.id
          })
        }
      }} />)
    }
    return null
  }

  BuildFormItemInput.propTypes = itemPropTypes;

  const BuildFormItem = (item, label, rules) => {
    if(hiddenMap[item.key]){
      return null
    }
    return (
      <Form.Item key={item.key} name={item.key} label={label} rules={rules}>
        { BuildFormItemInput(item) }
      </Form.Item>
    )
  }

  const  BuildFormList = () => {
    return realFormKeys.map(item => {
      // 优先使用传递的label，否则使用该组件配置的，都不存在尝试使用key
      const label = t(item.label || labelMap[item.key] || item.key)

      const preMsgMap = {
        'input': 'pleaseEnter',
        'textarea': 'pleaseEnter',
        'number': 'pleaseEnter',
        'select': 'pleaseSelect',
        'checkbox': 'pleaseSelect',
        'checkbox.group': 'pleaseSelect',
        'boolean': 'pleaseSelect',
      }
      // 默认认为表单的全部字段为必传，除非某一条目配置 required: false
      const rules = item.rules || [{
        required: item.required === false ? false : true,
        message: t(preMsgMap[item.type] || 'pleaseAdd') + label
      }]
      if(hiddenMap[item.key]){ // 某一表单字段是显示隐藏受控
        return null
      }
      return BuildFormItem(item, label, rules)
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
        name="form_in_modal"
        disabled={ disabled }
      >
        <BuildFormList />
      </Form>
    </Modal>
  )
}

EditForm.propTypes = {
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  apiPath: PropTypes.string.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  labelSpan: PropTypes.number,
  domain: PropTypes.string,
  permission: PropTypes.string,
  formData: PropTypes.object,
  maxCount: PropTypes.number,
  formKeys: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)),
  appendData: PropTypes.object,
  saveDataFormat: PropTypes.func, // 在发送请求给到后端前对表单数据进行转换
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default EditForm
