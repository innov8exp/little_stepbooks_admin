import { Modal, message } from 'antd'
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
  let insertStart = 0;
  let editIndex = 0;
  
  useEffect(() => {
    if (id) {
      axios.get(`/api/admin/v1/detail-image-cut?detailImgId=${id}&currentPage=1&pageSize=100`).then(res => {
        if (res && res.status === HttpStatus.OK) {
          const arr = res.data.map(item => {
            return { ...item, isDelete: false }
          })
          setImgArr(arr)
        }
      }).catch((err) => message.error(`load error:${err.message}`))
    }else{
      setImgArr([])
    }
  }, [id, visible])

  const onOneImgPicker = (e) => {
    const file = e.target.files[0]
    setImgArr(imgArr.map((item, index) => {
      if(editIndex === index){
        return {
          ...item,
          imgId: null,
          imgUrl: URL.createObjectURL(file),
          file
        }
      }else{
        return item
      }
    }))
  }

  const onImgPickerChange = (e) => {
    const arr = []
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        arr.push({
          imgUrl: URL.createObjectURL(file),
          file,
          isDelete: false
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
  const onEdit = index => {
    editIndex = index
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
        return { ...item, isDelete: true }
      }else{
        return item
      }
    }))
  }

  const update = (item, data) => {
    return new Promise(function (resolve, reject) {
      axios.put(`/api/admin/v1/detail-image-cut/${item.id}`, data).then(res => {
        if (res && res.status === HttpStatus.OK){
          resolve({
            ...item,
            ...data,
            file: null
          })
        }else{
          reject()
        }
      }).catch(err => reject(err))
    })
  }
  const add = (data) => {
    return new Promise(function (resolve, reject) {
      axios.post(`/api/admin/v1/detail-image-cut`, data).then(res => {
        if (res && res.status === HttpStatus.OK){
          resolve(res)
        }else{
          reject()
        }
      }).catch(err => reject(err))
    })
  }

  const uploadImg = (file) => {
    return new Promise(function (resolve, reject) {
      const form = new FormData()
      form.append('file', file)
      axios({
          method:'post',
          url: '/api/admin/v1/medias/upload?permission=PUBLIC&domain=PRODUCT',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: form
      }).then(res => {
        if (res && res.status === HttpStatus.OK) {
          const { objectUrl, id } = res.data;
          resolve({
            imgId: id,
            imgUrl: objectUrl
          })
        }else{
          reject(res.message)
        }
      }).catch((err) => reject(err))
    })
  }

  const updateByLocalImg = (item, sortIndex) => {
    return new Promise(function (resolve, reject) {
      uploadImg(item.file).then(({ imgId, imgUrl }) => {
        update(item, {
          imgId,
          imgUrl,
          sortIndex
        }).then(res => resolve(res)).catch(err => reject(err))
      }).catch((err) => reject(err))
    })
  }

  const addByLocalImg = (item, sortIndex, detailImgId) => {
    return new Promise(function (resolve, reject) {
      uploadImg(item.file).then(({ imgId, imgUrl }) => {
        add({
          sortIndex,
          detailImgId,
          imgId,
          imgUrl
        }).then(res => resolve(res)).catch(err => reject(err))
      }).catch((err) => reject(err))
    })
  }

  const saveData = (detailImgId) => {
    const tasks = [];
    imgArr.filter(item => {
      if(item.isDelete){
        if(item.id){ // 已存在的数据调用接口删除
          tasks.push(axios.delete(`/api/admin/v1/detail-image-cut/${item.id}`))
        }
        return false
      }else{
        return true
      }
    }).forEach((item, index) => {
      // 是已存在的图片资源，更新排序值或url
      if(item.id){
        if(item.file){ // 使用本地的文件来做替换
          tasks.push(updateByLocalImg(item, index))
        }else if(item.sortIndex != index){ // 有过排序上的调整，更新排序
          tasks.push(update(item, { sortIndex: index }))
        }
      }else{
        tasks.push(addByLocalImg(item, index, detailImgId))
      }
    })
    if(tasks.length > 0){
      Promise.all(tasks).then(() => {
        onSave(detailImgId)
      }).catch(err => {
        console.log(err)
      })
    }else{
      message.info(t('message.dataHasNotChanged'))
      onCancel()
    }
  }

  const onOk = () => {
    if(id){
      saveData(id)
    }else{
      axios.post('/api/admin/v1/detail-image', { name: detailName }).then(res => {
        if (res && res.status === HttpStatus.OK) {
          saveData(res.data.id)
        }
      })
    }
  }

  const ImgList = () => {
    if(imgArr.some(item => !item.isDelete)){
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
    if(!item.isDelete){
      return (
        <div style={{ position: 'relative' }} key={index}>
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
              <EditOutlined onClick={() => onEdit(index)} />
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
