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
import axios from '../../libs/network'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '../../components/styled'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom';

const { confirm } = Modal

const OrderPage = () => {
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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryCriteria?.orderNo, queryCriteria?.username])

  const handleDeleteAction = (id) => {
    confirm({
      title: '确定删除当前记录？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        axios
          .delete(`/api/admin/v1/orders/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success('操作成功!')
            }
          })
          .catch((err) => {
            message.error(`操作失败，原因：${err.response?.data?.message}`)
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
    <Card title='订单管理'>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}>
        <Row>
          <Col span={6}>
            <Form.Item label='订单编号' name='orderNo'>
              <Input placeholder='请输入订单编号' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='用户' name='username'>
              <Input placeholder='请输入用户名' />
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
                type='default'
                onClick={handleReset}>
                重置
              </Button>
            </ConditionLeftItem>
            <ConditionLeftItem>
              <Button
                icon={<SearchOutlined />}
                type='primary'
                onClick={handleQuery}>
                查询
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
              title: '订单编号',
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
              title: '用户名',
              key: 'username',
              dataIndex: 'username',
            },
            {
              title: '用户昵称',
              key: 'nickname',
              dataIndex: 'nickname',
            },
            {
              title: '交易金额',
              key: 'transactionAmount',
              dataIndex: 'transactionAmount',
              render: (text) =>
                `$ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            },
            {
              title: '书币数量',
              key: 'coinAmount',
              dataIndex: 'coinAmount',
            },
            {
              title: '状态',
              key: 'status',
              dataIndex: 'status',
              render: (text) => {
                return text === 'PAID' ? (
                  <Tag color='green'>已支付</Tag>
                ) : (
                  <Tag color='red'>未支付</Tag>
                )
              },
            },
            {
              title: '操作',
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

                    <Divider type='vertical' />
                    <Button
                      type='link'
                      danger
                      onClick={() => handleDeleteAction(record.id)}>
                      删除
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
