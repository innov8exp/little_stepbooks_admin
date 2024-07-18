import { App, Button, Card, message, Table, Switch, Form, Input, Row, } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import EditForm from '@/components/edit-form'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons'

const SkuListPage = () => {
  const priceFormKeys = [
    { type:'input', key: 'skuName', label: 'name' },
    { type:'number', min: 0.01, max: null, prefix:'￥', key: 'originalPrice' },
    { type:'number', min: 0.01, max: null, prefix:'￥', key: 'price' },
    { type:'number', min: 0, max: 99999, key: 'sortIndex'},
  ]
  const pointFormKeys = [
    { type:'input', key: 'skuName', label: 'name' },
    { type:'number', min: 1, max: 1000000, key: 'originalPrice', label: 'originalPoint' },
    { type:'number', min: 1, max: 1000000, key: 'price', label: 'point' },
    { type:'number', min: 0, max: 99999, key: 'sortIndex'},
  ]
  const params = useParams()
  const location = useLocation()
  const spuId = params?.id;
  const isPoint = location.pathname.includes('point');
  const formKeys = isPoint ? pointFormKeys : priceFormKeys;
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [queryForm] = Form.useForm()
  const [listData, setListData] = useState([])
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [switchLoading, setSwitchLoading] = useState({})
  const navigate = useNavigate()
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
    const searchURL = `/api/admin/v1/sku?currentPage=1&pageSize=10&spuId=${spuId}`
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
  }, [spuId])

  const loadListData = function (currentPage) {
    setLoading(true)
    currentPage = currentPage || pageNumber
    let queryStr = ''
    const queryData = queryForm.getFieldsValue()
    for (const key in queryData) {
      if(queryData[key]){
        queryStr += `&${key}=${encodeURIComponent(queryData[key])}`
      }
    }
    const searchURL = `/api/admin/v1/sku?currentPage=${currentPage}&pageSize=${pageSize}&spuId=${spuId}` + queryStr
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

  const handleReset = () => {
    queryForm.resetFields()
  }

  const handleAddAction = () => {
    setEdiVisible(true)
    setEditData({})
  }

  const handleEditAction = (item) => {
    setEdiVisible(true)
    setEditData(item)
  }

  const handleGoodsAction = ({ id, spuId }) => {
    navigate(`/${isPoint ? 'sku-point-goods-list' : 'sku-goods-list'}/${id}/${spuId}`)
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
          .post(`/api/admin/v1/sku/${id}/${status}`)
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

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios.delete(`/api/admin/v1/sku/${id}`)
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

  return (
    <Card title={t(isPoint ? 'productPoint' : 'productPrice')} extra={
      <Button style={{ marginLeft: '20px' }} type="primary" onClick={handleAddAction}>
          {t('button.create')}
      </Button>
    }>
      <Form form={queryForm}>
        <Row>
            <Form.Item label={t('name')} name="name">
              <Input placeholder={t('message.placeholder.name')} allowClear={true} />
            </Form.Item>
            <Button icon={<SearchOutlined />} type="primary" onClick={() => loadListData()} style={{ margin: '0 15px' }}>{t('button.search')} </Button>
            <Button icon={<UndoOutlined />} onClick={handleReset}>{t('button.reset')} </Button>
        </Row>
      </Form>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('name')}`,
            key: 'skuName',
            dataIndex: 'skuName',
          },
          {
            title: `${t(isPoint ? 'originalPoint' : 'originalPrice')}`,
            key: 'originalPrice',
            dataIndex: 'originalPrice',
          },
          {
            title: `${t(isPoint ? 'point' : 'price')}`,
            key: 'price',
            dataIndex: 'price',
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('sortIndex')}`,
            key: 'sortIndex',
            dataIndex: 'sortIndex',
            width: 80
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
                  checked={text === 'ON_SHELF'}
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
                    onClick={() => handleGoodsAction(record)}
                    type="link"
                  >
                    {t('bindGoods')}
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
        apiPath='sku'
        domain='PRODUCT'
        title={isPoint ? 'productPoint' : 'productPrice'}
        formData={editData}
        appendData={{ spuId }}
        formKeys={formKeys}
        onCancel={() => setEdiVisible(false)}
        onSave={() => {
          setEdiVisible(false)
          loadListData()
        }}
      />
    </Card>
  )
}

export default SkuListPage