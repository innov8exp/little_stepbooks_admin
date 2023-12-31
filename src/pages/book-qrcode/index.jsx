import {
  ConditionItem,
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from '@/components/styled'
import useFetch from '@/hooks/useFetch'
import {
  ExclamationCircleOutlined,
  LeftCircleOutlined,
  PlusOutlined,
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
  QRCode,
  Row,
  Table,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import BookQRCodeForm from './form'

const BookQRCodePage = () => {
  const { modal } = App.useApp()
  const { t } = useTranslation()
  const [queryForm] = Form.useForm()
  const params = useParams()
  const bookId = params?.bookId
  const navigate = useNavigate()
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [booksData, setBooksData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  // const [queryCriteria, setQueryCriteria] = useState()
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)

  const { fetchedData } = useFetch(`/api/admin/v1/books/${bookId}`, [])

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const fetchBookQRCodes = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/books-qrcode?bookId=${bookId}&currentPage=${pageNumber}&pageSize=${pageSize}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setBooksData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [bookId, pageNumber, pageSize, t])

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/books-qrcode/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success(`${t('message.archiveSuccessful')}`)
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
    // const queryValue = queryForm.getFieldsValue()
    // setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  const handleCreateAction = () => {
    setFormVisible(true)
  }

  const handleDownloadAction = (index) => {
    const canvas = document.getElementById(index)?.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL()
      const a = document.createElement('a')
      a.download = 'QRCode.png'
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  useEffect(() => {
    fetchBookQRCodes()
  }, [fetchBookQRCodes, pageNumber, changeTimestamp])

  return (
    <>
      <Card
        title={
          <>
            <Button
              type="link"
              size="large"
              icon={<LeftCircleOutlined />}
              onClick={() => navigate(`/books`)}
            />
            《{fetchedData?.bookName}》- {t('title.content')}
          </>
        }
      >
        <Form
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          form={queryForm}
          initialValues={{ category: '', status: '' }}
        >
          <Row>
            <Col span={6}>
              <Form.Item label={t('title.code')} name="code">
                <Input placeholder={t('message.placeholder.code')} />
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
                title: `${t('title.code')}`,
                key: 'qrCode',
                dataIndex: 'qrCode',
              },
              {
                title: `${t('title.qrcode')}`,
                key: 'qrCodeUrl',
                dataIndex: 'qrCodeUrl',
                render: (text, record, index) => (
                  <div id={index}>
                    <QRCode value={text} />
                  </div>
                ),
              },
              {
                title: `${t('title.createTime')}`,
                key: 'createdAt',
                dataIndex: 'createdAt',
              },
              {
                title: `${t('title.operate')}`,
                key: 'action',
                render: (text, record, index) => {
                  return (
                    <div>
                      <Button
                        type="link"
                        onClick={() => handleDownloadAction(index)}
                      >
                        {t('button.download')}
                      </Button>
                      <Divider type="vertical" />
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteAction(record.id)}
                      >
                        {t('button.delete')}
                      </Button>
                    </div>
                  )
                },
              },
            ]}
            rowKey={(record) => record.id}
            dataSource={booksData}
            loading={loading}
            pagination={paginationProps}
          />
        </ContentContainer>
      </Card>
      <BookQRCodeForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false)
          setChangeTimestamp(Date.now())
        }}
        bookId={bookId}
      />
    </>
  )
}

export default BookQRCodePage
