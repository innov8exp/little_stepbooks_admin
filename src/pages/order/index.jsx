import {
  CopyOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Table,
  Tag,
  message,
  Select,
  DatePicker,
} from 'antd'
const { RangePicker } = DatePicker;
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '../../components/styled'
// import { useHistory } from 'react-router-dom';
import { formatMoney } from '@/libs/util'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import RefundRejectForm from './refund-reject-form'
import ShipForm from './ship-form'
import useFetch from '@/hooks/useFetch'

const OrderPage = () => {
  const dateFormat = 'YYYY-MM-DD'
  const defaultDateValue = [
    dayjs(new Date(new Date().setHours(0, 0, 0))),
    dayjs(new Date(new Date().setHours(0, 0, 0)))
  ]
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [queryForm] = Form.useForm()
  // const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [ordersData, setOrdersData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [queryCriteria, setQueryCriteria] = useState({})
  const [formVisible, setFormVisible] = useState(false)
  const [refundApproveFormVisible, setRefundApproveFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const orderStateRes = useFetch(`/api/admin/v1/orders/states`, [])

  const navigate = useNavigate()

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const fetchOrders = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/orders/search?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.orderCode) {
      searchURL += `&orderCode=${queryCriteria.orderCode}`
    }
    if (queryCriteria?.storeType) {
      searchURL += `&storeType=${queryCriteria.storeType}`
    }
    if (queryCriteria?.state) {
      searchURL += `&state=${queryCriteria.state}`
    }
    if (queryCriteria?.startDate) {
      searchURL += `&startDate=${queryCriteria.startDate}&endDate=${queryCriteria.endDate}`
    }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setOrdersData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [
      pageNumber,
      pageSize,
      queryCriteria.orderCode,
      queryCriteria.storeType,
      queryCriteria.state,
      queryCriteria.startDate,
      queryCriteria.endDate,
      t
    ])

  const handleCloseAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.close')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/orders/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success(t('message.successInfo'))
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

  const handleQuery = () => {
    const params = getQueryValue()
    setQueryCriteria(params)
    const timestamp = new Date().getTime()
    setChangeTimestamp(timestamp)
  }

  const handleDownload = () => {
    const params = getQueryValue()
    if(!params.startDate){
      message.error(t('pleaseSelect') + t('startEndDate'))
    }
    let searchURL = `/api/admin/v1/orders/export?startDate=${params.startDate}&endDate=${params.endDate}`
    if (params?.orderCode) {
      searchURL += `&orderCode=${params.orderCode}`
    }
    if (params?.username) {
      searchURL += `&username=${params.username}`
    }
    if (params?.state) {
      searchURL += `&state=${params.state}`
    }
    window.open(searchURL)
  }

  const getQueryValue = () => {
    const queryValue = queryForm.getFieldsValue()
    const { orderCode, state, storeType, startEndDateArr } = queryValue;
    const params = { orderCode, state, storeType }
    if(startEndDateArr && startEndDateArr.length > 0){
      params.startDate = startEndDateArr[0].format(dateFormat)
      params.endDate = startEndDateArr[1].format(dateFormat)
    }
    return params
  }

  const handleReset = () => {
    queryForm.resetFields()
    queryForm.setFieldsValue({
      startEndDateArr: []
    })
  }

  const handleShipAction = (id) => {
    setSelectedId(id)
    setFormVisible(true)
  }

  const handleSignAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.sign')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/orders/${id}/sign`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success(t('message.successInfo'))
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

  const handleViewAction = (id) => {
    navigate(`/order-form?id=${id}`)
  }

  const handleCopyAction = (orderCode) => {
    navigator.clipboard.writeText(orderCode)
    message.success(t('message.copySuccess'))
  }

  const handleApproveRefundRequest = (id) => {
    setRefundApproveFormVisible(true)
    setSelectedId(id)
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, pageNumber, changeTimestamp])

  return (
    <>
      <Card title={t('title.label.orderManagement')}>
        <Form
          form={queryForm}
          initialValues={{ 
            category: '',
            status: '',
            storeType: 'REGULAR',
            startEndDateArr: defaultDateValue
          }}
        >
          <Row>
            <Col span={6}>
              <Form.Item label={t('title.label.orderNumber')} name="orderCode">
                <Input placeholder={t('message.placeholder.orderNumber')} style={{ width: '90%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t('storeType')} name="storeType" style={{ width: '90%' }}>
                <Select placeholder={t('message.placeholder.pleaseSelect')} allowClear={true} options={[
                  { value: 'REGULAR', label: t('normalGoods') },
                  { value: 'POINTS', label: t('pointGoods') }
                ]} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={t('title.label.orderState')} name="state" style={{ width: '90%' }}>
                <Select
                  placeholder={t('message.placeholder.pleaseSelect')}
                  loading={orderStateRes.loading}
                  options={orderStateRes.fetchedData
                    ?.filter((item) => item !== 'INIT')
                    ?.map((item) => {
                      return { label: t(item), value: item }
                    })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={t('startEndDate')} name="startEndDateArr">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider style={{ marginTop: 0, marginBottom: 10 }} dashed />
        <ContentContainer>
          <StyledRightCondition>
            <QueryBtnWrapper>
              <ConditionLeftItem>
                <Button
                  icon={<UndoOutlined />}
                  type="default"
                  onClick={handleReset}
                >
                  {t('button.reset')}
                </Button>
              </ConditionLeftItem>
              <ConditionLeftItem>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  onClick={handleQuery}
                >
                  {t('button.search')}
                </Button>
              </ConditionLeftItem>
              <ConditionLeftItem>
                <Button
                  icon={<DownloadOutlined />}
                  type="primary"
                  onClick={handleDownload}
                >
                  {t('orderDownload')}
                </Button>
              </ConditionLeftItem>
            </QueryBtnWrapper>
          </StyledRightCondition>
          <Table
            columns={[
              {
                title: '#',
                key: 'number',
                render: (text, record, index) =>
                  (pageNumber - 1) * pageSize + index + 1,
              },
              {
                title: `${t('title.label.orderNumber')}`,
                key: 'orderCode',
                dataIndex: 'orderCode',
                width: 240,
                render: (text, record) => (
                  <>
                    <Button
                      style={{ paddingRight: 0 }}
                      type="link"
                      onClick={() => handleCopyAction(text)}
                    >
                      <CopyOutlined />
                    </Button>
                    <Button
                      onClick={() => handleViewAction(record.id)}
                      type="link"
                    >
                      {text}
                    </Button>
                  </>
                ),
              },
              {
                title: `${t('title.recipient')}`,
                key: 'recipient',
                render: (text, record) => (
                  <>
                    {record.recipientName}
                    <br/>
                    { record.recipientPhone }
                  </>
                )
              },
              {
                title: `${t('title.recipientAddress')}`,
                key: 'recipientAddress',
                render: (text, record) => {
                  return (
                  <>
                    {record.recipientProvince}{ record.recipientCity }{ record.recipientDistrict } - { record.recipientAddress }
                  </>
                )}
              },
              {
                title: `${t('price/point')}`,
                key: 'totalAmount',
                dataIndex: 'totalAmount',
                render: (text, record) => {
                  if(record.storeType === 'POINTS'){
                    return text
                  }else{
                    return formatMoney(text)
                  }
                },
              },
              {
                title: `${t('title.createTime')}`,
                key: 'createdAt',
                dataIndex: 'createdAt',
              },
              {
                title: `${t('title.paymentStatus')}`,
                key: 'paymentStatus',
                dataIndex: 'paymentStatus',
                render: (text) => {
                  return text === 'PAID' ? (
                    <Tag color="green">{t('title.paid')}</Tag>
                  ) : (
                    <Tag color="red">{t('title.unpaid')}</Tag>
                  )
                },
              },
              {
                title: `${t('title.status')}`,
                key: 'state',
                dataIndex: 'state',
                render: (text) => {
                  if (text === 'FINISHED') {
                    return <Tag color="gold-inverse">{t(text)}</Tag>
                  } else {
                    return <Tag color="blue">{t(text)}</Tag>
                  }
                },
              },
              {
                title: `${t('title.wdtSyncStatus')}`,
                key: 'wdtSyncStatus',
                dataIndex: 'wdtSyncStatus',
                render: (text) => {
                  if (text === 'DONE') {
                    return <Tag color="green">{t('title.wdtSyncStatus.done')}</Tag>
                  } else if (text === 'INIT') {
                    return <Tag color="blue">{t('title.wdtSyncStatus.init')}</Tag>
                  } else if (text === 'REJECTED') {
                    return <Tag color="red">{t('title.wdtSyncStatus.rejected')}</Tag>
                  } else {
                    // NO_NEED
                    return <Tag color="gold-inverse">{t('title.wdtSyncStatus.noNeed')}</Tag>
                  }
                },
              },
              {
                title: `${t('title.operate')}`,
                key: 'action',
                render: (text, record) => {
                  return (
                    <div>
                      {record.state === 'PAID' &&
                        record.productNature !== 'VIRTUAL' && (
                          <>
                            <Divider type="vertical" />
                            <Button
                              type="link"
                              onClick={() => handleShipAction(record.id)}
                            >
                              {t('button.ship')}
                            </Button>
                          </>
                        )}

                      {record.state === 'SHIPPED' && (
                        <>
                          <Divider type="vertical" />
                          <Button
                            type="link"
                            onClick={() => handleSignAction(record.id)}
                          >
                            {t('button.sign')}
                          </Button>
                        </>
                      )}

                      {record.refundRequestStatus === 'REFUND_REQUEST' && (
                        <>
                          <Divider type="vertical" />
                          <Button
                            type="link"
                            onClick={() =>
                              handleApproveRefundRequest(record.id)
                            }
                          >
                            {t('button.refundApprove')}
                          </Button>
                        </>
                      )}

                      {record.state === 'PLACED' && (
                        <>
                          <Divider type="vertical" />
                          <Button
                            type="link"
                            danger
                            onClick={() => handleCloseAction(record.id)}
                          >
                            {t('button.close')}
                          </Button>
                        </>
                      )}

                      {/* {record.state === 'REFUNDING' &&
                        record.productNature === 'PHYSICAL' && (
                          <>
                            <Divider type="vertical" />
                            <Button
                              type="link"
                              onClick={() =>
                                handleMockRefundPaymentAction(record.id)
                              }
                            >
                              {t('button.mockRefundPayment')}
                            </Button>
                          </>
                        )} */}
                    </div>
                  )
                },
              },
            ]}
            rowKey={(record) => record.id}
            dataSource={ordersData}
            loading={loading}
            pagination={paginationProps}
          />
        </ContentContainer>
      </Card>
      <ShipForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false)
          setChangeTimestamp(Date.now())
        }}
        id={selectedId}
      />
      <RefundRejectForm
        visible={refundApproveFormVisible}
        onCancel={() => setRefundApproveFormVisible(false)}
        onSave={() => {
          setRefundApproveFormVisible(false)
          setChangeTimestamp(Date.now())
        }}
        id={selectedId}
      />
    </>
  )
}

export default OrderPage
