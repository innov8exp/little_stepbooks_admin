import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '@/components/styled'
import { Routes } from '@/libs/router'
import { SearchOutlined, UndoOutlined } from '@ant-design/icons'
import {
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
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const OrderInventoryLogPage = () => {
  const { t } = useTranslation()
  const [queryForm] = Form.useForm()
  // const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [records, setRecords] = useState()
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
    let searchURL = `/api/admin/v1/order-inventory-logs?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.skuCode) {
      searchURL += `&skuCode=${queryCriteria.skuCode}`
    }
    if (queryCriteria?.orderCode) {
      searchURL += `&username=${queryCriteria.orderCode}`
    }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setRecords(responseObject.records)
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
    queryCriteria?.skuCode,
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

  const handleProductViewAction = (id) => {
    navigate(`${Routes.PRODUCT_VIEW.path}?id=${id}`)
  }

  const handleOrderViewAction = (id) => {
    navigate(`${Routes.ORDER_FORM.path}?id=${id}`)
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, pageNumber, changeTimestamp])

  return (
    <>
      <Card title={t('menu.orderInventoryLogList')}>
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
              <Form.Item label={t('title.label.orderCode')} name="orderCode">
                <Input placeholder={t('message.placeholder.orderCode')} />
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
                  <Button
                    onClick={() => handleProductViewAction(record.productId)}
                    type="link"
                  >
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
                title: `${t('title.orderCode')}`,
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
              {
                title: `${t('title.inventoryQuantity')}`,
                key: 'quantity',
                dataIndex: 'quantity',
              },
            ]}
            rowKey={(record) => record.id}
            dataSource={records}
            loading={loading}
            pagination={paginationProps}
          />
        </ContentContainer>
      </Card>
    </>
  )
}

export default OrderInventoryLogPage
