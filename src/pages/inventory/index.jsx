import { Routes } from '@/libs/router'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
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
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '../../components/styled'
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const InventoryPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [queryForm] = Form.useForm()
  // const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [inventoriesData, setInventoriesData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [queryCriteria, setQueryCriteria] = useState()
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
    let searchURL = `/api/admin/v1/inventories?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.skuCode) {
      searchURL += `&skuCode=${queryCriteria.skuCode}`
    }
    // if (queryCriteria?.username) {
    //   searchURL += `&username=${queryCriteria.username}`
    // }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setInventoriesData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryCriteria?.skuCode, t])

  const handleCloseAction = (id) => {
    modal.confirm({
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

  const handleEditAction = (id) => {
    navigate(`${Routes.ORDER_FORM.path}?id=${id}`)
  }

  const handleViewAction = (id) => {
    navigate(`${Routes.ORDER_VIEW.path}?id=${id}`)
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, pageNumber, changeTimestamp])

  return (
    <Card title={t('menu.inventory')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label={t('title.label.skuCode')} name="skuCode">
              <Input placeholder={t('message.placeholder.skuCode')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.label.skuName')} name="skuName">
              <Input placeholder={t('message.placeholder.skuName')} />
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
              title: `${t('title.label.skuCode')}`,
              key: 'skuCode',
              dataIndex: 'skuCode',
              width: 150,
              render: (text, record) => (
                <Button onClick={() => handleViewAction(record.id)} type="link">
                  {text}
                </Button>
              ),
            },
            {
              title: `${t('title.skuName')}`,
              key: 'skuName',
              dataIndex: 'skuName',
            },
            {
              title: `${t('title.inventoryQuantity')}`,
              key: 'inventoryQuantity',
              dataIndex: 'inventoryQuantity',
            },
            {
              title: `${t('title.createTime')}`,
              key: 'createdAt',
              dataIndex: 'createdAt',
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    <Button
                      type="link"
                      onClick={() => handleEditAction(record.id)}
                    >
                      编辑
                    </Button>

                    <Divider type="vertical" />
                    <Button
                      type="link"
                      danger
                      onClick={() => handleCloseAction(record.id)}
                    >
                      {t('button.close')}
                    </Button>
                  </div>
                )
              },
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={inventoriesData}
          loading={loading}
          pagination={paginationProps}
        />
      </ContentContainer>
    </Card>
  )
}

export default InventoryPage
