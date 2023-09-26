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
import axios from 'axios'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '../../components/styled'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// import { useHistory } from 'react-router-dom';

const { confirm } = Modal

const ConsumptionPage = () => {
  const { t } = useTranslation()
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
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
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
      title: `${t('message.tips.delete')}`,
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
    fetchConsumptions()
  }, [fetchConsumptions, pageNumber, changeTimestamp])

  return (
    <Card title={t('title.label.consumption')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item
              label={t('title.label.orderNumber')}
              name="consumeOrderNo"
            >
              <Input placeholder={t('message.placeholder.orderNumber')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.label.bookName')} name="bookName">
              <Input placeholder={t('message.placeholder.bookName')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.label.userNickName')} name="username">
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
              title: `${t('title.label.books')}`,
              key: 'bookName',
              dataIndex: 'bookName',
            },
            {
              title: `${t('title.chapter')}`,
              key: 'chapterName',
              dataIndex: 'chapterName',
            },
            {
              title: `${t('title.coinAmount')}`,
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
              title: `${t('title.clientPlatform')}`,
              key: 'clientPlatform',
              dataIndex: 'clientPlatform',
              render: (text) => {
                return text === 'IOS' ? 'iOS' : 'Android'
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
