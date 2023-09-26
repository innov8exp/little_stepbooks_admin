import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Table,
  Tag,
} from 'antd'
// import { Routes } from '../../common/config';
import axios from 'axios'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '../../components/styled'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

const OrderPage = () => {
  const { t } = useTranslation()
  const [queryForm] = Form.useForm()
  // const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [ordersData, setOrdersData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [queryCriteria, setQueryCriteria] = useState()

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
    if (queryCriteria?.orderNo) {
      searchURL += `&orderNo=${queryCriteria.orderNo}`
    }
    if (queryCriteria?.username) {
      searchURL += `&username=${queryCriteria.username}`
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
  }, [pageNumber, pageSize, queryCriteria?.orderNo, queryCriteria?.username])

  const handleDeleteAction = (id) => {
    confirm({
      title: `${t('message.tips.delete')}`,
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
    const timestamp = new Date().getTime()
    setChangeTimestamp(timestamp)
    const queryValue = queryForm.getFieldsValue()
    setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  // const handleEditAction = (id) => {
  //     history.push(`${Routes.main.routes.bookForm.path}?id=${id}`);
  // };

  // const handleViewAction = (id) => {
  //     history.push(`${Routes.main.routes.bookView.path}?id=${id}`);
  // };

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, pageNumber, changeTimestamp])

  return (
    <Card title={t('title.label.orderManagement')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label={t('title.label.orderNumber')} name="orderNo">
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
              title: `${t('title.label.orderNumber')}`,
              key: 'orderNo',
              dataIndex: 'orderNo',
              width: 150,
              // render: (text, record) => (
              //     <Button
              //         onClick={() => handleViewAction(record.id)}
              //         type="link"
              //     >
              //         {text}
              //     </Button>
              // ),
            },
            {
              title: `${t('title.label.userNickName')}`,
              key: 'username',
              dataIndex: 'username',
            },
            {
              title: `${t('title.userNickname')}`,
              key: 'nickname',
              dataIndex: 'nickname',
            },
            {
              title: `${t('title.transactionAmount')}`,
              key: 'transactionAmount',
              dataIndex: 'transactionAmount',
              render: (text) =>
                `$ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            },
            {
              title: `${t('title.label.numberOfBookCoins')}`,
              key: 'coinAmount',
              dataIndex: 'coinAmount',
            },
            {
              title: `${t('title.status')}`,
              key: 'status',
              dataIndex: 'status',
              render: (text) => {
                return text === 'PAID' ? (
                  <Tag color="green">{t('title.paid')}</Tag>
                ) : (
                  <Tag color="red">{t('Unpaid')}</Tag>
                )
              },
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    {/* <Button
                                            type="link"
                                            onClick={() =>
                                                handleEditAction(record.id)
                                            }
                                        >
                                            编辑
                                        </Button> */}

                    <Divider type="vertical" />
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteAction(record.id)}
                    >
                      {t('button.delete')}
                    </Button>
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
  )
}

export default OrderPage
