import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, message, App, Table, Image } from 'antd'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import AdvertisementForm from './form'
import { useTranslation } from 'react-i18next'

const AdvertisementPage = () => {
  const { modal } = App.useApp()
  const { t } = useTranslation()
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/advertisements`, [
    changeTime,
  ])
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()

  const handleEditAction = (id) => {
    setSelectedId(id)
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
          .delete(`/api/admin/v1/advertisements/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              setChangeTime(Date.now())
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
      },
    })
  }

  return (
    <Card title={t('title.advertisingSettings')} extra={
      <Button
        type="primary"
        onClick={() => {
          setSelectedId(undefined)
          setFormVisible(true)
        }}
      >
        {t('button.create')}
      </Button>
    }>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('title.promotionalImages')}`,
            key: 'adsImgUrl',
            dataIndex: 'adsImgUrl',
            render: (text) => <Image height={50} src={text} />,
          },
          {
            title: `${t('DESCRIPTION')}`,
            key: 'introduction',
            dataIndex: 'introduction',
          },
          {
            title: `${t('title.label.appOrH5Url')}`,
            key: 'actionUrl',
            dataIndex: 'actionUrl',
          },
          {
            title: `${t('title.label.miniUrl')}`,
            key: 'wxActionUrl',
            dataIndex: 'wxActionUrl',
          },
          {
            title: `${t('title.adType')}`,
            key: 'adsType',
            dataIndex: 'adsType',
            render: (text) =>
              text === 'RECOMMEND'
                ? `${t('radio.label.RECOMMEND')}`
                : `${t('radio.label.CAROUSEL')}`,
          },
          {
            title: `${t('title.ORDER')}`,
            key: 'sortIndex',
            dataIndex: 'sortIndex',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 160,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record.id)}
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
        dataSource={fetchedData}
        pagination={false}
        loading={loading}
      />
      <AdvertisementForm
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

export default AdvertisementPage
