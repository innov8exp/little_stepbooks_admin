import ViewItem from '@/components/view-item'
import useFetch from '@/hooks/useFetch'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import { formatMoney } from '@/libs/util'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
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
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [productNature, setProductNature] = useState()
  const [orderData, setOrderData] = useState()

  const deliveryCompanyResponse = useFetch(
    '/api/admin/v1/orders/ship-companies',
    [],
  )

  const eventLogsResponse = useFetch(
    `/api/admin/v1/orders/${queryId}/event-logs`,
    [queryId, t],
  )

  const paymentsResponse = useFetch(
    `/api/admin/v1/orders/${queryId}/payments`,
    [queryId, t],
  )

  const productsResponse = useFetch(
    `/api/admin/v1/orders/${queryId}/products`,
    [queryId, t],
  )

  const deliveryResponse = useFetch(
    `/api/admin/v1/orders/${queryId}/delivery`,
    [queryId, t],
  )

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/orders/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setInitFormData({
            ...resultData,
          })
          setOrderData(resultData)
          setProductNature(resultData?.productNature)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
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

  useEffect(() => {
    form.setFieldsValue({ ...deliveryResponse?.fetchedData })
  }, [deliveryResponse?.fetchedData, form])

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
              ...deliveryResponse?.fetchedData,
            }}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Card type="inner" title={t('title.basicInformation')}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <ViewItem
                        label={t('title.orderCode')}
                        value={orderData?.orderCode}
                      />
                    </Col>
                    <Col span={12}>
                      <ViewItem
                        label={t('title.orderDateTime')}
                        value={orderData?.createdAt}
                      />
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={12}>
                      <ViewItem
                        label={t('title.recipientPhone')}
                        value={orderData?.recipientPhone}
                      />
                    </Col>
                    <Col span={12}>
                      <ViewItem
                        label={t('title.totalAmount')}
                        value={formatMoney(orderData?.totalAmount)}
                      />
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={12}>
                      <ViewItem
                        label={t('title.paymentStatus')}
                        value={t(orderData?.paymentStatus)}
                      />
                    </Col>
                    <Col span={12}>
                      <ViewItem
                        label={t('title.state')}
                        value={t(orderData?.state)}
                      />
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
                                `${Routes.PRODUCT_VIEW.path}?id=${record.productId}`,
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
                        render: (text) => formatMoney(text),
                      },
                      {
                        title: `${t('title.label.productNature')}`,
                        key: 'productNature',
                        dataIndex: 'productNature',
                        render: (text) => <Tag color="blue">{t(text)}</Tag>,
                      },
                      {
                        title: `${t('title.label.quantity')}`,
                        key: 'quantity',
                        dataIndex: 'quantity',
                      },
                    ]}
                    rowKey={(record) => record?.id}
                    dataSource={[productsResponse?.fetchedData]}
                    loading={productsResponse?.loading}
                    pagination={false}
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
                        title: `${t('title.label.paymentType')}`,
                        key: 'paymentType',
                        dataIndex: 'paymentType',
                        render: (text) => t(text),
                      },
                      {
                        title: `${t('title.label.paymentMethod')}`,
                        key: 'paymentMethod',
                        dataIndex: 'paymentMethod',
                        render: (text) => t(text),
                      },
                      {
                        title: `${t('title.transactionAmount')}`,
                        key: 'transactionAmount',
                        dataIndex: 'transactionAmount',
                        render: (text) => formatMoney(text),
                      },
                      {
                        title: `${t('title.label.vendorPaymentNo')}`,
                        key: 'vendorPaymentNo',
                        dataIndex: 'vendorPaymentNo',
                      },
                      {
                        title: `${t('title.label.transactionStatus')}`,
                        key: 'transactionStatus',
                        dataIndex: 'transactionStatus',
                        render: (text) => <Tag color="blue">{t(text)}</Tag>,
                      },
                    ]}
                    rowKey={(record) => record.id}
                    dataSource={paymentsResponse?.fetchedData}
                    loading={paymentsResponse?.loading}
                    pagination={false}
                  />
                </Card>
                {productNature === 'PHYSICAL' && (
                  <Card
                    style={{
                      marginTop: 16,
                    }}
                    type="inner"
                    title={t('title.deliveryInformation')}
                  >
                    <Row gutter={8}>
                      <Col span={12}>
                        <ViewItem
                          label={t('title.deliveryMethod')}
                          value={t(
                            deliveryResponse?.fetchedData?.deliveryMethod,
                          )}
                        />
                      </Col>
                      <Col span={12}>
                        <ViewItem
                          label={t('title.deliveryStatus')}
                          value={t(
                            deliveryResponse?.fetchedData?.deliveryStatus,
                          )}
                        />
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="deliveryCompany"
                          label={t('title.deliveryCompany')}
                        >
                          <Select
                            placeholder={t(
                              'message.placeholder.selectDeliveryCompany',
                            )}
                          >
                            {deliveryCompanyResponse?.fetchedData?.map(
                              ({ code, name }) => (
                                <Select.Option key={code} value={code}>
                                  {name}
                                </Select.Option>
                              ),
                            )}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="deliveryCode"
                          label={t('title.deliveryCode')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="recipientName"
                          label={t('title.recipientName')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="recipientPhone"
                          label={t('title.recipientPhone')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="recipientProvince"
                          label={t('title.recipientProvince')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="recipientCity"
                          label={t('title.recipientCity')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="recipientDistrict"
                          label={t('title.recipientDistrict')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="recipientAddress"
                          label={t('title.recipientAddress')}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                )}
              </Col>
              <Col span={8}>
                <Card type="inner" title={t('title.eventLogInformation')}>
                  <Timeline
                    mode="left"
                    items={eventLogsResponse?.fetchedData?.map((item) => {
                      return {
                        children:
                          t(item.eventTime) +
                          ' [' +
                          t(item.eventType) +
                          ']' +
                          ' ' +
                          t(item.fromState) +
                          ' -> ' +
                          t(item.toState),
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
