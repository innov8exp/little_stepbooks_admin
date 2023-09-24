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

const ConsumptionPage = () => {
  const [queryForm] = Form.useForm()
  // const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [consumptionsData, setConsumptionsData] = useState()
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

  const fetchConsumptions = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/consumptions/search?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.bookName) {
      searchURL += `&bookName=${queryCriteria.bookName}`
    }
    if (queryCriteria?.username) {
      searchURL += `&username=${queryCriteria.username}`
    }
    if (queryCriteria?.consumeOrderNo) {
      searchURL += `&consumeOrderNo=${queryCriteria.consumeOrderNo}`
    }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setConsumptionsData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(`操作失败，原因：${err.response?.data?.message}`)
      )
      .finally(() => setLoading(false))
  }, [
    pageNumber,
    pageSize,
    queryCriteria?.bookName,
    queryCriteria?.consumeOrderNo,
    queryCriteria?.username,
  ])

  const handleDeleteAction = (id) => {
    confirm({
      title: '确定删除当前记录？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        axios
          .delete(`/api/admin/v1/consumptions/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.NO_CONTENT) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success('归档成功!')
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
    fetchConsumptions()
  }, [fetchConsumptions, pageNumber, changeTimestamp])

  return (
    <Card title='消费明细'>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}>
        <Row>
          <Col span={6}>
            <Form.Item label='订单编号' name='consumeOrderNo'>
              <Input placeholder='请输入订单编号' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='书籍名称' name='bookName'>
              <Input placeholder='请输入书籍名称' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='用户名' name='username'>
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
              key: 'consumeOrderNo',
              dataIndex: 'consumeOrderNo',
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
              title: '书籍',
              key: 'bookName',
              dataIndex: 'bookName',
            },
            {
              title: '章节',
              key: 'chapterName',
              dataIndex: 'chapterName',
            },
            {
              title: '消费书币数量',
              key: 'coinAmount',
              dataIndex: 'coinAmount',
            },
            // {
            //     title: '消费书币类型',
            //     key: 'consumeType',
            //     dataIndex: 'consumeType',
            //     render: (text) => {
            //         return text === 'RECHARGE'
            //             ? '充值'
            //             : '系统赠送';
            //     },
            // },
            {
              title: '用户平台',
              key: 'clientPlatform',
              dataIndex: 'clientPlatform',
              render: (text) => {
                return text === 'IOS' ? 'iOS' : 'Android'
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
          dataSource={consumptionsData}
          loading={loading}
          pagination={paginationProps}
        />
      </ContentContainer>
    </Card>
  )
}

export default ConsumptionPage
