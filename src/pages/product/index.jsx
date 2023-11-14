import { ButtonWrapper } from '@/components/styled'
import { Routes } from '@/libs/router'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { App, Button, Card, Image, Table, Tag, Tooltip, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const ProductPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const [changeTime, setChangeTime] = useState(Date.now())
  const [productsData, setProductsData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)

  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

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
    // if (queryCriteria?.orderNo) {
    //   searchURL += `&orderNo=${queryCriteria.orderNo}`
    // }
    // if (queryCriteria?.username) {
    //   searchURL += `&username=${queryCriteria.username}`
    // }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setProductsData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, t])

  const handleEditAction = (id) => {
    navigate(`${Routes.PRODUCT_FORM.path}?id=${id}`)
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

  useEffect(() => {
    fetchProducts()
  }, [pageNumber, changeTime, fetchProducts])

  return (
    <Card title={t('menu.skuList')}>
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => navigate(Routes.PRODUCT_FORM.path)}
        >
          {t('button.create')}
        </Button>
      </ButtonWrapper>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('title.cover')}`,
            key: 'coverImg',
            dataIndex: 'coverImg',
            render: (text) => <Image width={50} src={text} />,
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
            title: `${t('title.productName')}`,
            key: 'skuName',
            dataIndex: 'skuName',
          },
          {
            title: `${t('title.price')}`,
            key: 'price',
            dataIndex: 'price',
            render: (text) => `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          },
          {
            title: `${t('title.label.platform')}`,
            key: 'platform',
            dataIndex: 'platform',
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
            title: `${t('title.operate')}`,
            key: 'action',
            width: 300,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record.id)}
                    type="link"
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    danger
                    type="link"
                  >
                    {t('button.delete')}
                  </Button>
                </div>
              )
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={productsData}
        pagination={paginationProps}
        loading={loading}
      />
    </Card>
  )
}

export default ProductPage
