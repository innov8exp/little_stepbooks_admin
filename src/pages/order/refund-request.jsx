import { Routes } from '@/libs/router'
import { formatMoney } from '@/libs/util'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
  CopyOutlined,
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
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '@/components/styled'
import RefundRejectForm from './refund-reject-form'
import RefundApproveForm from './refund-approve-form'

const RefundRequestPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [queryForm] = Form.useForm()
  // const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [requestsData, setRequestsData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [queryCriteria, setQueryCriteria] = useState()
  const [refundRejectFormVisible, setRefundRejectFormVisible] = useState(false)
  const [refundApproveFormVisible, setRefundApproveFormVisible] =
    useState(false)
  const [selectedId, setSelectedId] = useState()
  const [selectedData, setSelectedData] = useState()

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
    let searchURL = `/api/admin/v1/refund-requests/search?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.orderCode) {
      searchURL += `&orderCode=${queryCriteria.orderCode}`
    }
    if (queryCriteria?.username) {
      searchURL += `&username=${queryCriteria.username}`
    }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setRequestsData(responseObject.records)
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
    queryCriteria?.orderCode,
    queryCriteria?.username,
    t,
  ])

  const handleQuery = () => {
    const timestamp = new Date().getTime()
    setChangeTimestamp(timestamp)
    const queryValue = queryForm.getFieldsValue()
    setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  // const handleEditAction = (id) => {
  //   navigate(`${Routes.ORDER_FORM.path}?id=${id}`)
  // }

  const handleRejectAction = (id) => {
    setSelectedId(id)
    setRefundRejectFormVisible(true)
  }

  const handleSignAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.returnSign')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/refund-requests/${id}/return-delivery-sign`)
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

  const handleApproveAction = (id) => {
    setSelectedId(id)
    setSelectedData(requestsData?.find((item) => item.id === id))
    setRefundApproveFormVisible(true)
  }

  const handleOrderViewAction = (id) => {
    navigate(`${Routes.ORDER_FORM.path}?id=${id}`)
  }

  const handleViewAction = (id) => {
    navigate(`${Routes.REFUND_REQUEST_VIEW.path}?id=${id}`)
  }

  const handleCopyAction = (code) => {
    navigator.clipboard.writeText(code)
    message.success(t('message.copySuccess'))
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, pageNumber, changeTimestamp])

  return (
    <>
      <Card title={t('menu.refundRequest')}>
        <Form
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          form={queryForm}
          initialValues={{ category: '', status: '' }}
        >
          <Row>
            <Col span={6}>
              <Form.Item label={t('title.label.orderNumber')} name="orderCode">
                <Input placeholder={t('message.placeholder.orderNumber')} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={t('title.label.userName')} name="username">
                <Input placeholder={t('message.placeholder.enterUserName')} />
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
                title: `${t('title.code')}`,
                key: 'id',
                dataIndex: 'id',
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
                title: `${t('title.label.orderNumber')}`,
                key: 'orderCode',
                dataIndex: 'orderCode',
                render: (text, record) => (
                  <Button
                    onClick={() => handleOrderViewAction(record.orderId)}
                    type="link"
                  >
                    {text}
                  </Button>
                ),
              },
              // {
              //   title: `${t('title.nickname')}`,
              //   key: 'nickname',
              //   dataIndex: 'nickname',
              // },
              {
                title: `${t('title.userPhone')}`,
                key: 'phone',
                dataIndex: 'phone',
              },
              {
                title: `${t('title.refundAmount')}`,
                key: 'refundAmount',
                dataIndex: 'refundAmount',
                render: (text) => formatMoney(text),
              },
              {
                title: `${t('title.refundReason')}`,
                key: 'refundReason',
                dataIndex: 'refundReason',
              },
              {
                title: `${t('title.createTime')}`,
                key: 'createdAt',
                dataIndex: 'createdAt',
              },
              {
                title: `${t('title.requestStatus')}`,
                key: 'requestStatus',
                dataIndex: 'requestStatus',
                render: (text) => {
                  return text === 'PENDING' ? (
                    <Tag color="magenta">{t(text)}</Tag>
                  ) : (
                    <Tag color="blue">{t(text)}</Tag>
                  )
                },
              },
              {
                title: `${t('title.refundStatus')}`,
                key: 'refundStatus',
                dataIndex: 'refundStatus',
                render: (text) => <Tag color="blue">{t(text)}</Tag>,
              },
              {
                title: `${t('title.operate')}`,
                key: 'action',
                render: (text, record) => {
                  return (
                    <div>
                      {record.requestStatus === 'PENDING' && (
                        <>
                          <Button
                            type="link"
                            onClick={() => handleApproveAction(record.id)}
                          >
                            {t('button.approve')}
                          </Button>
                          <Divider type="vertical" />
                          <Button
                            type="link"
                            onClick={() => handleRejectAction(record.id)}
                          >
                            {t('button.reject')}
                          </Button>
                        </>
                      )}
                      {record.refundStatus === 'REFUNDING_WAIT_SIGN' && (
                        <>
                          <Button
                            type="link"
                            onClick={() => handleSignAction(record.id)}
                          >
                            {t('button.sign')}
                          </Button>
                        </>
                      )}
                    </div>
                  )
                },
              },
            ]}
            rowKey={(record) => record.id}
            dataSource={requestsData}
            loading={loading}
            pagination={paginationProps}
          />
        </ContentContainer>
      </Card>
      <RefundRejectForm
        visible={refundRejectFormVisible}
        onCancel={() => setRefundRejectFormVisible(false)}
        onSave={() => {
          setRefundRejectFormVisible(false)
          setChangeTimestamp(Date.now())
        }}
        id={selectedId}
      />
      <RefundApproveForm
        visible={refundApproveFormVisible}
        onCancel={() => setRefundApproveFormVisible(false)}
        onSave={() => {
          setRefundApproveFormVisible(false)
          setChangeTimestamp(Date.now())
        }}
        id={selectedId}
        data={selectedData}
      />
    </>
  )
}

export default RefundRequestPage
