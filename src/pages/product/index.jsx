import {
  ConditionItem,
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from '@/components/styled'
import { Routes } from '@/libs/router'
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Divider,
  Image,
  Switch,
  Table,
  Tag,
  Tooltip,
  Form,
  message,
  Row,
  Col,
  Input,
  Space,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatMoney } from '@/libs/util'

const ProductPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const [changeTime, setChangeTime] = useState()
  const [products, setProducts] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [queryForm] = Form.useForm()
  const [queryCriteria, setQueryCriteria] = useState()
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState({})

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const fetchProducts = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/products?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.skuCode) {
      searchURL += `&skuCode=${queryCriteria.skuCode}`
    }
    if (queryCriteria?.skuName) {
      searchURL += `&skuName=${queryCriteria.skuName}`
    }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          console.log([...responseObject.records])
          setProducts([...responseObject.records])
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryCriteria?.skuCode, queryCriteria?.skuName, t])

  const handleEditAction = (id) => {
    navigate(`${Routes.PRODUCT_FORM.path}?id=${id}`)
  }

  const handleUpdateStatusAction = (id, status) => {
    setSwitchLoading({ id, loading: true })
    modal.confirm({
      title: `${t('message.tips.changeStatus')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/products/${id}/status/${status}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              setChangeTime(Date.now())
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
          .finally(() => {
            setSwitchLoading({ id, loading: false })
          })
      },
      onCancel() {
        console.log('ni hao')
        setSwitchLoading({ id, loading: false })
        setChangeTime(Date.now())
      },
    })
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/products/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              setChangeTime(Date.now())
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
      },
    })
  }

  const handleQuery = () => {
    const timestamp = new Date().getTime()
    setChangeTime(timestamp)
    console.log(timestamp)
    const queryValue = queryForm.getFieldsValue()
    setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  const handleCreateAction = () => {
    navigate(Routes.PRODUCT_FORM.path)
  }

  useEffect(() => {
    fetchProducts()
  }, [pageNumber, changeTime, fetchProducts])

  return (
    <Card title={t('menu.skuList')}>
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} form={queryForm}>
        <Row>
          <Col span={6}>
            <Form.Item label={t('title.skuCode')} name="skuCode">
              <Input placeholder={t('message.placeholder.skuCode')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.skuName')} name="skuName">
              <Input placeholder={t('message.placeholder.skuName')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider style={{ marginTop: 0, marginBottom: 10 }} dashed />
      <ContentContainer>
        <StyledCondition>
          <QueryBtnWrapper>
            <ConditionItem>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => handleCreateAction()}
              >
                {t('button.create')}
              </Button>
            </ConditionItem>
          </QueryBtnWrapper>
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
        </StyledCondition>
        <Table
          columns={[
            {
              title: '#',
              key: 'number',
              render: (text, record, index) =>
                (pageNumber - 1) * pageSize + index + 1,
            },
            {
              title: `${t('title.cover')}`,
              key: 'coverImgUrl',
              dataIndex: 'coverImgUrl',
              render: (text) => <Image height={50} src={text} />,
            },
            {
              title: `${t('title.productNumber')}`,
              key: 'skuCode',
              dataIndex: 'skuCode',
              render: (text, record) => (
                <Button onClick={() => handleEditAction(record.id)} type="link">
                  <Tooltip title={record.description}>{text}</Tooltip>
                </Button>
              ),
            },
            {
              title: `${t('title.skuName')}`,
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
              title: `${t('title.label.materials')}`,
              key: 'parsedMaterials',
              dataIndex: 'parsedMaterials',
              render: (text) => (
                <Space>
                  {text.map((item) => (
                    <Tag key={item} color="blue">
                      {item}
                    </Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: `${t('title.label.productNature')}`,
              key: 'productNature',
              dataIndex: 'productNature',
              render: (text) => {
                return text === 'PHYSICAL' ? (
                  <Tag color="blue">{t(text)}</Tag>
                ) : (
                  <Tag color="magenta">{t(text)}</Tag>
                )
              },
            },
            {
              title: `${t('title.status')}`,
              key: 'status',
              dataIndex: 'status',
              render: (text, record) => {
                console.log(text)
                return (
                  <Switch
                    checkedChildren={t('ON_SHELF')}
                    unCheckedChildren={t('OFF_SHELF')}
                    checked={text === 'ON_SHELF'}
                    loading={
                      switchLoading.id === record.id && switchLoading.loading
                    }
                    onClick={(checked) =>
                      handleUpdateStatusAction(
                        record.id,
                        checked ? 'ON_SHELF' : 'OFF_SHELF',
                      )
                    }
                  />
                )
              },
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              width: 300,
              render: (text, record) => {
                return (
                  <>
                    {record.status !== 'ON_SHELF' && (
                      <>
                        <Divider type="vertical" />
                        <Button
                          onClick={() => handleEditAction(record.id)}
                          type="link"
                        >
                          {t('button.edit')}
                        </Button>
                        <Divider type="vertical" />
                        <Button
                          onClick={() => handleDeleteAction(record.id)}
                          danger
                          type="link"
                        >
                          {t('button.delete')}
                        </Button>
                      </>
                    )}
                  </>
                )
              },
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={products}
          pagination={paginationProps}
          loading={loading}
        />
      </ContentContainer>
    </Card>
  )
}

export default ProductPage
