import useFetch from '@/hooks/useFetch'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Skeleton,
  Table,
  Tag,
  Timeline,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const OrderForm = () => {
  const { t } = useTranslation()
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [productsData, setProductsData] = useState([])

  const { fetchedData } = useFetch(
    `/api/admin/v1/orders/${queryId}/event-logs`,
    [queryId, t],
  )

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)
    setProductLoading(true)

    axios
      .get(`/api/admin/v1/orders/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setInitFormData({
            ...resultData,
          })
          const productId = resultData?.productId
          if (!productId) {
            setProductLoading(false)
            return
          }
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))

    axios
      .get(`/api/admin/v1/orders/${queryId}/products`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const product = res.data
          setProductsData(product)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setProductLoading(false))
  }, [queryId, t])

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/books', {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.BOOK_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (book) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/orders/${queryId}`, {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.BOOK_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const handleSaveAction = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('数字：', values)
        if (queryId) {
          updateData({
            ...values,
            classifications: Array.from(new Set(values.classifications)),
          })
        } else {
          createData({
            ...values,
            classifications: Array.from(new Set(values.classifications)),
          })
        }
      })
      .catch()
  }

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(Routes.ORDER_LIST.path)}
          />
          {t('button.orderEditing')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            form={form}
            initialValues={{
              ...initFormData,
            }}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Card type="inner" title={t('title.basicInformation')}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item name="orderCode" label={t('title.orderCode')}>
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="createdAt"
                        label={t('title.orderDateTime')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="recipientPhone"
                        label={t('title.recipientPhone')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="totalAmount"
                        label={t('title.totalAmount')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="paymentStatus"
                        label={t('title.paymentStatus')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="state" label={t('title.state')}>
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card
                  style={{
                    marginTop: 16,
                  }}
                  type="inner"
                  title={t('title.productInformation')}
                >
                  <Table
                    columns={[
                      {
                        title: '#',
                        key: 'number',
                        render: (text, record, index) => index + 1,
                      },
                      {
                        title: `${t('title.label.skuCode')}`,
                        key: 'skuCode',
                        dataIndex: 'skuCode',
                        width: 260,
                        render: (text, record) => (
                          <Button
                            onClick={() =>
                              navigate(
                                `${Routes.PRODUCT_VIEW.path}?id=${record.id}`,
                              )
                            }
                            type="link"
                          >
                            {text}
                          </Button>
                        ),
                      },
                      {
                        title: `${t('title.label.skuName')}`,
                        key: 'skuName',
                        dataIndex: 'skuName',
                      },
                      {
                        title: `${t('title.price')}`,
                        key: 'price',
                        dataIndex: 'price',
                        render: (text) =>
                          `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                      },
                      {
                        title: `${t('title.label.platform')}`,
                        key: 'platform',
                        dataIndex: 'platform',
                      },
                      {
                        title: `${t('title.label.hasInventory')}`,
                        key: 'hasInventory',
                        dataIndex: 'hasInventory',
                        render: (text) => {
                          return text ? (
                            <Tag color="blue">{t('title.yes')}</Tag>
                          ) : (
                            <Tag color="red">{t('title.no')}</Tag>
                          )
                        },
                      },
                    ]}
                    rowKey={(record) => record.id}
                    dataSource={productsData}
                    loading={productLoading}
                  />
                </Card>

                <Card
                  style={{
                    marginTop: 16,
                  }}
                  type="inner"
                  title={t('title.transactionInformation')}
                >
                  <Table
                    columns={[
                      {
                        title: '#',
                        key: 'number',
                        render: (text, record, index) => index + 1,
                      },
                      {
                        title: `${t('title.label.skuCode')}`,
                        key: 'skuCode',
                        dataIndex: 'skuCode',
                        width: 260,
                        render: (text, record) => (
                          <Button
                            onClick={() =>
                              navigate(
                                `${Routes.PRODUCT_VIEW.path}?id=${record.id}`,
                              )
                            }
                            type="link"
                          >
                            {text}
                          </Button>
                        ),
                      },
                      {
                        title: `${t('title.label.skuName')}`,
                        key: 'skuName',
                        dataIndex: 'skuName',
                      },
                      {
                        title: `${t('title.price')}`,
                        key: 'price',
                        dataIndex: 'price',
                        render: (text) =>
                          `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                      },
                      {
                        title: `${t('title.label.platform')}`,
                        key: 'platform',
                        dataIndex: 'platform',
                      },
                      {
                        title: `${t('title.label.hasInventory')}`,
                        key: 'hasInventory',
                        dataIndex: 'hasInventory',
                        render: (text) => {
                          return text ? (
                            <Tag color="blue">{t('title.yes')}</Tag>
                          ) : (
                            <Tag color="red">{t('title.no')}</Tag>
                          )
                        },
                      },
                    ]}
                    rowKey={(record) => record.id}
                    dataSource={productsData}
                    loading={productLoading}
                  />
                </Card>

                <Card
                  style={{
                    marginTop: 16,
                  }}
                  type="inner"
                  title={t('title.deliveryInformation')}
                >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="deliveryMethod"
                        label={t('title.deliveryMethod')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="deliveryStatus"
                        label={t('title.deliveryStatus')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="deliveryCompany"
                        label={t('title.deliveryCompany')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {' '}
                      <Form.Item
                        name="deliveryCode"
                        label={t('title.deliveryCode')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="recipientName"
                        label={t('title.recipientName')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="recipientPhone"
                        label={t('title.recipientPhone')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="recipientAddress"
                        label={t('title.recipientAddress')}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card type="inner" title={t('title.eventLogInformation')}>
                  <Timeline
                    mode="left"
                    items={fetchedData?.map((item) => {
                      return {
                        children:
                          item.eventTime +
                          ' [' +
                          item.eventType +
                          ']' +
                          ' ' +
                          item.fromState +
                          ' -> ' +
                          item.toState,
                      }
                    })}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: 10 }} />
            <Row justify="end">
              <Col>
                <Button type="default" onClick={() => form.resetFields()}>
                  {t('button.reset')}
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button
                  loading={saveLoading}
                  type="primary"
                  onClick={() => handleSaveAction()}
                >
                  {t('button.saveData')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default OrderForm
