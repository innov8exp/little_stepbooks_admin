import { App, Button, Card, message, Table, Image } from 'antd'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import EditForm from '@/components/edit-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import BatchUploadList from '@/components/batch-upload'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const VideoListPage = () => {
  const params = useParams()
  const goodsId = params?.id;
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [listData, setListData] = useState([])
  const [batchVisible, setBatchVisible] = useState(false)
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const pageSize = 10;
  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
      loadListData()
    }
  }

  // 页面创建后加载一遍数据
  useEffect(() => {
    const searchURL = `/api/admin/v1/virtual-goods-video?currentPage=1&pageSize=10&goodsId=${goodsId}`
    axios.get(searchURL).then((res) => {
      if (res && res.status === HttpStatus.OK) {
        const { records, total } = res.data;
        setListData(records)
        setTotal(total)
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })
  }, [goodsId])

  const loadListData = function () {
    setLoading(true)
    const searchURL = `/api/admin/v1/virtual-goods-video?currentPage=${pageNumber}&pageSize=${pageSize}&goodsId=${goodsId}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setListData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddAction = () => {
    setEdiVisible(true)
    setEditData({})
  }

  const handleEditAction = (item) => {
    setEdiVisible(true)
    setEditData(item)
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios.delete(`/api/admin/v1/physical-goods/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              loadListData()
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
      },
    })
  }

  const onVideoAdd = (data) => {
    const { sortIndex, photoId, photoUrl, videoId, videoUrl, name, duration } = data;
    return new Promise(function (resolve, reject){
      axios
      .post(`/api/admin/v1/virtual-goods-video`, {
        sortIndex,
        goodsId,
        name,
        coverId: photoId,
        coverUrl: photoUrl,
        videoId,
        videoUrl,
        duration
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          resolve()
        }else{
          reject()
        }
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  const onBatchOk = () => {
    setBatchVisible(false)
    loadListData()
  }

  const onBatchCancel = () => {
    setBatchVisible(false)
  }

  return (
    <Card title={t('menu.virtualVideoList')}>
      <ButtonWrapper>
          <Button type="primary" onClick={() => {
            setBatchVisible(true)
          }}>
              {t('button.batchAddVideo')}
          </Button>
          <Button style={{ marginLeft: '20px' }} type="primary" onClick={handleAddAction}>
              {t('button.addVideo')}
          </Button>
      </ButtonWrapper>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('name')}`,
            key: 'name',
            dataIndex: 'name',
          },
          {
            title: `${t('coverImage')}`,
            key: 'coverUrl',
            dataIndex: 'coverUrl',
            render: (text) => <Image height={50} src={text} />,
          },
          {
            title: `${t('duration')}`,
            key: 'duration',
            dataIndex: 'duration',
          },
          {
            title: `${t('video')}`,
            key: 'videoUrl',
            dataIndex: 'videoUrl',
            render: (text, record) => {
                return(
                    <video
                      style={ {
                          width: '160px',
                          height: '90px'
                      }}
                      src={ record.videoUrl }
                      controls
                    ></video>
                )
            }
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 80,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record)}
                    type="link"
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    {t('button.delete')}
                  </Button>
                </div>
              )
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={listData}
        loading={loading}
        pagination={paginationProps}
      />
      <BatchUploadList
        visible={batchVisible}
        mediaType='VIDEO'
        domain={'PRODUCT'}
        onAdd={onVideoAdd}
        onOk={onBatchOk}
        onCancel={onBatchCancel}
      />
      <EditForm
        visible={ediVisible}
        apiPath='virtual-goods-video'
        domain='PRODUCT'
        title='title.virtualVideo'
        formData={editData}
        appendData={{ goodsId }}
        formKeys={[
          { type:'input', key: 'name'},
          { type:'photo', key: 'coverUrl', groupKeys:['coverId']},
          { type:'video', key: 'videoUrl', groupKeys:['videoId', 'duration']},
          { type:'number', min: 1, max: null, key: 'sortIndex' },
        ]}
        onCancel={() => setEdiVisible(false)}
        onSave={() => {
          setEdiVisible(false)
          loadListData()
        }}
      />
    </Card>
  )
}

export default VideoListPage