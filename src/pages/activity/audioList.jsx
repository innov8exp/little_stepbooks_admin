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

const AudioListPage = () => {
  const params = useParams()
  const collectionId = params?.activityId;
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [changeTime, setChangeTime] = useState(Date.now())
  const [activityData, setActivityData] = useState()
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [currentEditIsAudio, setCurrentEditIsAudio] = useState(true)
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

  const fetchPairedReadAudios = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/paired-read?currentPage=${pageNumber}&pageSize=${pageSize}&collectionId=${collectionId}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setActivityData(responseObject.records)
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

  const handleAddAction = (isAudio) => {
    setCurrentEditIsAudio(isAudio)
    setSelectedId(null)
    setFormVisible(true)
  }

  const handleEditAction = (item) => {
    setSelectedId(item.id)
    setCurrentEditIsAudio(item.type != 'VIDEO')
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
          .delete(`/api/admin/v1/paired-read/${id}`)
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
    fetchPairedReadAudios()
  }, [fetchPairedReadAudios, pageNumber, changeTime])

  const AddButtonWrapper = () => {
    if(activityData && activityData.length > 0){
      if(activityData[0].type === 'VIDEO'){
        return (
          <ButtonWrapper>
            <Button type="primary" onClick={() => handleAddAction(false)}>
              {t('button.addVideo')}
            </Button>
          </ButtonWrapper>
        )
      }else{
        return (
          <ButtonWrapper>
            <Button type="primary" onClick={() => handleAddAction(true)}>
              {t('button.addAudio')}
            </Button>
          </ButtonWrapper>
        )
      }
    }else{
      return (
        <ButtonWrapper>
          <Button type="primary" onClick={() => handleAddAction(true)} style={{ marginRight: '20px' }}>
            {t('button.addAudio')}
          </Button>
          <Button type="primary" onClick={() => handleAddAction(false)}>
            {t('button.addVideo')}
          </Button>
      </ButtonWrapper>
      )
    }
  }

  return (
    <Card title={t('button.audioManage')}>
      <AddButtonWrapper />
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
            title: `${t('title.audio')} / ${t('title.video')}`,
            key: 'audioUrl',
            dataIndex: 'audioUrl',
            render: (text, record) => {
              if(record.type === 'VIDEO'){
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
              }else{
                return(
                  <audio
                    controlsList="noplaybackrate nodownload"
                    style={ {
                      width: '240px',
                    } }
                    src={ record.audioUrl }
                    controls
                  ></audio>
                )
              }
            }
          },
          {
            title: `${t('title.cover')}`,
            key: 'coverImgUrl',
            dataIndex: 'coverImgUrl',
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
        dataSource={activityData}
        loading={loading}
        pagination={paginationProps}
      />
      <MediaForm
        isAudio={currentEditIsAudio}
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

export default AudioListPage
