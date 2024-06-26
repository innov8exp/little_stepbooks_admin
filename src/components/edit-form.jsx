import { Form, Input, Modal, message, Select, InputNumber, Checkbox, Switch, Radio } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ImageUpload from './image-upload'
import ImagesUpload from './images-upload'
import FileUpload from './file-upload'

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
  type: PropTypes.string,
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
  onSave,
  onCancel
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const isAdd = formData && formData.id ? false : true
  const url = `/api/admin/v1/${apiPath}` + (isAdd ? '' : `/${formData.id}`)
  const method = isAdd ? 'post' : 'put'
  const showTitle = t(title) + t('CONNECT_MARK1') + t(disabled ? 'view' : (isAdd ? 'button.create' : 'button.edit'))
  // 如果是新增行为，忽略排序字段的传参以及配置
  const realFormKeys = isAdd ? formKeys.filter(item => item.key != 'sortIndex') : formKeys

  // 存在一些冗余的字段需要独立维护，通过 hiddenData 对象进行维护
  // 视频、音频、图片资源需要追加对应的 id 字段， 视频、音频保持追加 duration 字段
  // check 表单同时维护id、name
  const hiddenFormData = {};
  realFormKeys.forEach(item => {
    item.groupKeys && item.groupKeys.forEach(key => {
      hiddenFormData[key] = formData[key]
    })
  })

  // 编辑显示的模式下，在下一个 event loop 对表单进行重置 
  if(visible){
    setTimeout(() => {
      form.setFieldsValue({
        ...formData
      })
    }, 0)
  }

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
      const data = Object.assign(values, hiddenFormData, appendData)
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

  const BuildFormItem = ({
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
    // ...props
  }) => {
    placeholder =  t(placeholder || placeholderMap[key] || key)
    if(type === 'input' || type === 'hidden'){
      return (<Input type="text" placeholder={placeholder} />)
    }
    if(type === 'textarea'){
      return (<TextArea placeholder={placeholder} />)
    }
    if(type === 'number'){
      return (<InputNumber style={{ width: 200 }} min={min} max={max} prefix={prefix} />)
    }
    if(type === 'boolean'){
      return (
        <Switch
          checkedChildren={t(checkedLabel)}
          unCheckedChildren={t(unCheckedLabel)}
          style={{ width: 100 }}
        />
      )
    }
    if(type === 'photo'){
      return (<ImageUpload domain={domain} permission={permission} value={formData[key]} onChange={res => {
        form.setFieldValue(key, res.url)
        if(groupKeys) {
          Object.assign(hiddenFormData, {
            [groupKeys[0]]: res.id
          })
        }
      }} />)
    }
    if(type === 'photo-list'){
      return (<ImagesUpload domain={domain} permission={permission} value={formData[key]} maxCount={maxCount} onChange={res => {
        form.setFieldValue(key, res)
      }} />)
    }
    if(type === 'select'){
      return (<Select placeholder={placeholder} mode={mode} options={options} />)
    }
    if(type === 'checkbox'){
      return (
        <Checkbox></Checkbox>
      )
    }
    if(type === 'checkbox.group'){
      return (
        <Checkbox.Group options={options} onChange={valueArr => {
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
        }} />
      )
    }
    if(type === 'radio.group'){
      return (
        <Radio.Group options={options.map(item => ({
          ...item,
          label: t(item.label)
        }))} />
      )
    }
    if(type === 'audio' || type === 'video'){
      const accept = type === 'audio' ? '.mp3,.m4a' : '.mp4'
      return (<FileUpload domain={domain} permission={permission} fileUrl={formData[key]} accept={accept} isMedia={true} onChange={res => {
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
      return (<FileUpload domain={domain} permission={permission} fileUrl={formData[key]} onChange={res => {
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

  BuildFormItem.propTypes = itemPropTypes;

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
      return (
        <Form.Item key={item.key} name={item.key} label={label} rules={rules}>
          { BuildFormItem(item) }
        </Form.Item>
      )
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
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default EditForm
