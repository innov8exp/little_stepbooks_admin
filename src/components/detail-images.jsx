import { Modal, message, Row, Col, Button } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  FolderOpenOutlined
} from '@ant-design/icons'


const DetailImages = ({ id, visible, detailName, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [imgArr, setImgArr] = useState([])
  const oneInputRef = useRef(null);
  const batchInputRef = useRef(null);
  const dataMapBeforeSave = {};
  let insertStart = 0;
  
  useEffect(() => {
    if (id) {
      axios.get(`/api/admin/v1/detail-image-cut?detailImgId=${id}`).then(res => {
        if (res && res.status === HttpStatus.OK) {
          setImgArr(res.data.map(item => {
            dataMapBeforeSave[item.imgId] = item;
            return { ...item, status: 'show' }
          }))
        }
      }).catch((err) => message.error(`load error:${err.message}`))
    }else{
      setImgArr([])
    }
  }, [dataMapBeforeSave, id, visible])

  const onOneImgPicker = (e) => {
    console.log(e)
  }

  const onImgPickerChange = (e) => {
    const arr = []
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        URL.createObjectURL(file)
        arr.push({
          imgUrl: URL.createObjectURL(file),
          file,
          status: 'show'
        })
    }
    const newArr = imgArr.slice()
    newArr.splice(insertStart, 0, ...arr)
    setImgArr(newArr)
  }
  

  const onBatchAdd = (index) => {
    insertStart = index || 0
    batchInputRef.current.click()
  }

  // 编辑其中一张照片
  const onEdit = item => {
    oneInputRef.current.click()
  }

  const onSortClick = (index, add) => {
    const target = index + add
    if(target < 0 || target === imgArr.length){
      return
    }
    const arr = imgArr.slice()
    arr[target] = imgArr[index]
    arr[index] = imgArr[target]
    setImgArr(arr)
  }

  // 删除一张照片
  const onDelete = (idx) => {
    setImgArr(imgArr.map((item, index) => {
      if(index === idx){
        return { ...item, status: 'delete' }
      }else{
        return item
      }
    }))
  }

  const saveData = (detailImgId) => {
    const tasks = [];
    onSave(detailImgId)
  }

  const onOk = () => {
    if(id){
      saveData(id)
    }else{
      axios.post('/api/admin/v1/detail-image', { name: detailName }).then(res => {
        if (res && res.status === HttpStatus.OK) {
          saveData(res.data.id, true)
        }
      })
    }
  }

  const ImgList = () => {
    if(imgArr.some(item => item.status === 'show')){
      return imgArr.map((item, index) => ImgContainer(item, index))
    }else{
      return (
        <div style={{ fontSize: 16, padding: '30px 0',textAlign: 'center', color: '#999', cursor: 'pointer' }} onClick={() => onBatchAdd()}>
          <div style={{ fontSize: 40 }}>
            <FolderOpenOutlined />
          </div>
          <div>{t('message.noDetailImg')}</div>
        </div>
      )
    }
  }

  const ImgContainer = (item, index) => {
    if(item.status === 'show'){
      return (
        <div style={{ position: 'relative' }}>
          <div style={{ width: 420 }}>
            <img src={item.imgUrl} alt="step" style={{ display: 'block', width: '100%', height: 'auto' }} />
            <div style={{ fontSize: 20, textAlign: 'center', lineHeight: 2, cursor: 'pointer' }} onClick={() => onBatchAdd(index + 1)}>
              <PlusOutlined />
            </div>
          </div>
          <div style={{ position: 'absolute', fontSize: 20, lineHeight: 2, left: 440, top: 0 }}>
            <div style={{ color: '#389e0d' }}>
              <ArrowUpOutlined onClick={() => onSortClick(index, -1)}  />
            </div>
            <div>
              <EditOutlined onClick={() => onEdit(item)} />
            </div>
            <div style={{ color: '#f00' }}>
              <DeleteOutlined onClick={() => onDelete(index)} />
            </div>
          </div>
          <div style={{ position: 'absolute', fontSize: 20, lineHeight: 2, left: 440, bottom: 40 }}>
            <div style={{ color: '#389e0d' }}>
              <ArrowDownOutlined onClick={() => onSortClick(index, 1)}  />
            </div>
          </div>
        </div>
      )
    }else{
      return null
    }
  }

  return (
    <Modal
      open={visible}
      width={524}
      title={t('title.detailImage')}
      okText={t('button.save')}
      cancelText={t('button.cancel')}
      onCancel={onCancel}
      onOk={onOk}
    >
      <div>
        <div style={{ height: 0, overflow: 'hidden' }}>
          <input ref={oneInputRef} type="file" accept='.png,.jpg,.jpeg,.gif' onChange={onOneImgPicker} />
          <input ref={batchInputRef} type="file" multiple accept='.png,.jpg,.jpeg,.gif' onChange={onImgPickerChange} />
        </div>
        <ImgList />
      </div>
    </Modal>
  )
}

DetailImages.propTypes = {
  id: PropTypes.string,
  visible: PropTypes.bool,
  detailName: PropTypes.string,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
}

export default DetailImages
