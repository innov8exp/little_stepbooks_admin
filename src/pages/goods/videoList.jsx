import { App, Button, Card, message, Table, Image } from 'antd'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState, useEffect, useCallback } from 'react'
import MediaForm from './audioForm'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const VideoListPage = () => {
  const params = useParams()
  const collectionId = params?.activityId;
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [changeTime, setChangeTime] = useState(Date.now())
  const [videoData, setVideoData] = useState()
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    }
  }

  const fetchGoodsVideos = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/virtual-goods-video?currentPage=${pageNumber}&pageSize=${pageSize}&collectionId=${collectionId}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setVideoData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, t])

  const handleAddAction = () => {
    setSelectedId(null)
    setFormVisible(true)
  }

  const handleEditAction = (item) => {
    setSelectedId(item.id)
    setFormVisible(true)
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/virtual-goods-video/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              setChangeTime(Date.now())
              message.success(`${t('message.archiveSuccessful')}`)
            }
          })
          .catch((err) => {
            message.error(
              `${t('message.error.failureReason')}${
                err.response?.data?.message
              }`,
            )
          })
      },
    })
  }

  useEffect(() => {
    fetchGoodsVideos()
  }, [fetchGoodsVideos, pageNumber, changeTime])


  return (
    <Card title={t('button.videoManage')}>
      <ButtonWrapper>
        <Button type="primary" onClick={handleAddAction}>
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
            title: `${t('title.name')}`,
            key: 'name',
            dataIndex: 'name',
          },
          {
            title: `${t('title.duration')}`,
            key: 'duration',
            dataIndex: 'duration',
          },
          {
            title: `${t('title.video')}`,
            key: 'videoUrl',
            dataIndex: 'videoUrl',
            render: (text, record) => {
                return(
                    <video
                    style={ {
                        width: '240px',
                        height: '135px'
                    } }
                    src={ record.videoUrl }
                    controls
                    ></video>
                )
            }
          },
          {
            title: `${t('title.cover')}`,
            key: 'coverUrl',
            dataIndex: 'coverUrl',
            render: (text) => text && <Image height={50} src={text} />,
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 160,
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
        dataSource={videoData}
        loading={loading}
        pagination={paginationProps}
      />
      <MediaForm
        isAudio={false}
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false)
          setChangeTime(Date.now())
        }}
        id={selectedId}
      />
    </Card>
  )
}

export default VideoListPage
