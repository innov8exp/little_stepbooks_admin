import ViewItem from '@/components/view-item'
import useFetch from '@/hooks/useFetch'
import useQuery from '@/hooks/useQuery'
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
  Image
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { deliveryCompanies } from '@/libs/deliveryCompanies'

const OrderForm = () => {
  const { t } = useTranslation()
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isPoint, setIsPoint] = useState(false)
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [productNature, setProductNature] = useState()
  const [orderData, setOrderData] = useState()

  const companies = deliveryCompanies

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
    `/api/admin/v1/orders/${queryId}/skus`,
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
          setIsPoint(resultData.storeType === 'POINTS')
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

  const updateData = (book) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/orders/${queryId}/delivery`, {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
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
        // console.log('数字：', values)
        const logisticsName = companies.filter(item=>item.id === values.logisticsType)[0].name;
        const val = { ...values, logisticsName };

        if (queryId) {
          updateData({
            ...val,
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

  useEffect(() => {
    console.log(productsResponse?.fetchedData)
  }, [productsResponse])
  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(-1)}
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
                        label={t(isPoint ? 'point' : 'title.totalAmount')}
                        value={isPoint ? (orderData?.totalAmount) : formatMoney(orderData?.totalAmount)}
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
                        title: `${t('spuName')}`,
                        key: 'spuName',
                        dataIndex: 'spuName',
                      },
                      {
                        title: t(isPoint ? 'point' : 'title.price'),
                        key: 'skuPrice',
                        dataIndex: 'skuPrice',
                        render: (text) => isPoint ? text : formatMoney(text),
                      },
                      {
                        title: `${t('title.label.skuName')}`,
                        key: 'skuName',
                        dataIndex: 'skuName',
                      },
                      {
                        title: `${t('title.cover')}`,
                        key: 'spuCoverImgUrl',
                        dataIndex: 'spuCoverImgUrl',
                        render: (text) => <Image height={50} src={text} />,
                      },
                      {
                        title: `${t('title.label.quantity')}`,
                        key: 'quantity',
                        dataIndex: 'quantity',
                      },
                    ]}
                    rowKey={(record) => record?.productId}
                    dataSource={productsResponse?.fetchedData}
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
                {productNature !== 'VIRTUAL' && (
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
                          name="logisticsType"
                          label={t('title.deliveryCompany')}
                        >
                          <Select placeholder={t('message.placeholder.selectDeliveryCompany')}>
                            {deliveryCompanies?.map(({ id, name }) => (
                              <Select.Option key={id} value={id}>
                                {name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="logisticsNo"
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
