import ViewItem from '@/components/view-item'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  QRCode,
  Row,
  Skeleton,
  Table,
  Tooltip,
  message,
  Image,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const BookSetView = () => {
  const { t } = useTranslation()
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [booksData, setBooksData] = useState([])
  const [bookLoading, setBookLoading] = useState(false)

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)
    setBookLoading(true)

    axios
      .get(`/api/admin/v1/book-sets/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setInitFormData({
            ...resultData,
          })
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
      .get(`/api/admin/v1/book-sets/${queryId}/books`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setBooksData(resultData)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setBookLoading(false))
  }, [queryId, t])

  const handleBookViewAction = (bookId) => {
    navigate(`/books/${bookId}/view`)
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
            onClick={() => navigate(Routes.BOOK_SET_LIST.path)}
          />
          {t('title.bookViewing')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Row>
            <Col span={12}>
              <ViewItem label={t('title.code')} value={initFormData?.code} />
            </Col>
            <Col span={12}>
              <ViewItem label={t('title.name')} value={initFormData?.name} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <ViewItem
                label={t('title.mnpQRCode')}
                value={<QRCode value={initFormData?.mnpQRCode || '-'} />}
              />
            </Col>
            <Col span={12}>
              <ViewItem
                label={t('title.description')}
                value={initFormData?.description}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
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
                      title: `${t('title.name')}`,
                      key: 'bookName',
                      dataIndex: 'bookName',
                      width: 150,
                      render: (text, record) => (
                        <Button
                          onClick={() => handleBookViewAction(record.id)}
                          type="link"
                        >
                          <Tooltip title={record.introduction} color="#2db7f5">
                            {text}
                          </Tooltip>
                        </Button>
                      ),
                    },
                    {
                      title: `${t('title.cover')}`,
                      key: 'coverImg',
                      dataIndex: 'coverImg',
                      render: (text) => <Image width={50} src={text} />,
                    },

                    {
                      title: `${t('title.author')}`,
                      key: 'author',
                      dataIndex: 'author',
                    },
                  ]}
                  rowKey={(record) => record.id}
                  dataSource={booksData}
                  loading={bookLoading}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default BookSetView
