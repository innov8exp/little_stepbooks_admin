import { App, Button, Card, message, Table, Image, Switch } from 'antd'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState, useEffect, useCallback } from 'react'
import PhysicalForm from './physical-form'
import { useTranslation } from 'react-i18next'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const ActivityListPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [changeTime, setChangeTime] = useState(Date.now())
  const [goodsData, setGoodsData] = useState()
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [switchLoading, setSwitchLoading] = useState({})
  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    }
  }

  const fetchGoods = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/physical-goods?currentPage=${pageNumber}&pageSize=${pageSize}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setGoodsData(responseObject.records)
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

  const handleEditAction = (id) => {
    setSelectedId(id)
    setFormVisible(true)
  }

  const handleUpdateStatusAction = (id, status) => {
    setSwitchLoading({ id, loading: true })
    modal.confirm({
      title: `${t('message.tips.changeStatus')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .post(`/api/admin/v1/physical-goods/${id}/${status}`)
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
          .finally(() => {
            setSwitchLoading({ id, loading: false })
          })
      },
      onCancel() {
        setSwitchLoading({ id, loading: false })
        setChangeTime(Date.now())
      },
    })
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

  useEffect(() => {
    fetchGoods()
  }, [fetchGoods, pageNumber, changeTime])

  return (
    <Card title={t('menu.physicalGoodsList')}>
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}
        >
          {t('button.create')}
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
            title: `${t('title.description')}`,
            key: 'description',
            dataIndex: 'description',
          },
          {
            title: `${t('title.cover')}`,
            key: 'coverUrl',
            dataIndex: 'coverUrl',
            render: (text) => <Image height={50} src={text} />,
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          // {
          //   title: `${t('title.status')}`,
          //   key: 'status',
          //   dataIndex: 'status',
          //   render: (text, record) => {
          //     return (
          //       <Switch
          //         checkedChildren={t('ONLINE')}
          //         unCheckedChildren={t('OFFLINE')}
          //         checked={text === 'ONLINE'}
          //         style={{
          //           width: '70px'
          //         }}
          //         loading={
          //           switchLoading.id === record.id && switchLoading.loading
          //         }
          //         onClick={(checked) =>
          //           handleUpdateStatusAction(
          //             record.id,
          //             checked ? 'online' : 'offline',
          //           )
          //         }
          //       />
          //     )
          //   },
          // },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 140,
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
        dataSource={goodsData}
        loading={loading}
        pagination={paginationProps}
      />
      <PhysicalForm
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

export default ActivityListPage
