import { App, Button, Card, message, Table, Image, Switch, Select, Row } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import EditForm from '@/components/edit-form'
import { useTranslation } from 'react-i18next'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'

const PhysicalListPage = () => {
  const apiPath = 'physical-goods'
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [listData, setListData] = useState([])
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [switchLoading, setSwitchLoading] = useState({})
  const [storeType, setStoreType] = useState('REGULAR')
  const [total, setTotal] = useState(0)
  const pageSize = 10;
  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      loadListData(current)
    }
  }

  // 页面创建后加载一遍数据
  useEffect(() => {
    const searchURL = `/api/admin/v1/${apiPath}?currentPage=1&pageSize=10`
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
  }, [])

  const loadListData = function (currentPage, type) {
    currentPage = currentPage || pageNumber
    setLoading(true)
    const searchURL = `/api/admin/v1/${apiPath}?currentPage=${pageNumber}&pageSize=${pageSize}&storeType=${type || storeType}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setPageNumber(currentPage)
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
        axios.delete(`/api/admin/v1/${apiPath}/${id}`)
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
          .post(`/api/admin/v1/${apiPath}/${id}/${status}`)
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
          .finally(() => {
            setSwitchLoading({ id, loading: false })
          })
      },
      onCancel() {
        setSwitchLoading({ id, loading: false })
      }
    })
  }

  return (
    <Card title={t('menu.physicalGoodsList')} extra={
      <Button type="primary" onClick={handleAddAction}>
        {t('button.create')}
      </Button>
    }>
      <div style={{marginBottom: '15px'}}>
          <Select placeholder={t('message.placeholder.pleaseSelect')} value={storeType} onChange={value => setStoreType(value)} options={[
            { value: 'REGULAR', label: t('normalGoods') },
            { value: 'POINTS', label: t('pointGoods') }
          ]} style={{ width: 150, marginRight: 25 }}/>
          <Button icon={<SearchOutlined />} type="primary" onClick={() => loadListData()}>{t('button.search')} </Button>
      </div>
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
            title: `${t('storeType')}`,
            key: 'storeType',
            dataIndex: 'storeType',
            render: (text) => t(text === 'POINTS' ? 'pointGoods' : 'normalGoods'),
          },
          {
            title: `${t('wdtGoodsNo')}`,
            key: 'wdtGoodsNo',
            dataIndex: 'wdtGoodsNo',
            width: 180
          },
          {
            title: `${t('sortIndex')}`,
            key: 'sortIndex',
            dataIndex: 'sortIndex',
            width: 80
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('title.status')}`,
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => {
              return (
                <Switch
                  checkedChildren={t('ON_SHELF')}
                  unCheckedChildren={t('OFF_SHELF')}
                  checked={text === 'ONLINE'}
                  style={{
                    width: '70px'
                  }}
                  loading={
                    switchLoading.id === record.id && switchLoading.loading
                  }
                  onClick={(checked) =>
                    handleUpdateStatusAction(
                      record.id,
                      checked ? 'online' : 'offline',
                    )
                  }
                />
              )
            },
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 90,
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
      <EditForm
        visible={ediVisible}
        apiPath={apiPath}
        domain='PRODUCT'
        title='title.physicalGoods'
        formData={editData}
        formKeys={[
          { type:'input', key: 'name'},
          { type:'textarea', key: 'description', required: false},
          { type:'photo', key: 'coverUrl', groupKeys:['coverId']},
          { type:'input', key: 'wdtGoodsNo', required: false},
          { type:'radio.group', key: 'storeType', label: 'storeType', disabled: (editData && !!editData.id), options: [
            { value: 'REGULAR', label: t('normalGoods') },
            { value: 'POINTS', label: t('pointGoods') },
          ]},
          { type:'number', min: 0, max: 99999, key: 'sortIndex'},
        ]}
        onCancel={() => setEdiVisible(false)}
        onSave={(saveData) => {
          setEdiVisible(false)
          setStoreType(saveData.storeType)
          loadListData(1, saveData.storeType)
        }}
      />
    </Card>
  )
}

export default PhysicalListPage
