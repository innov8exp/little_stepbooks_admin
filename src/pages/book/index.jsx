import {
  ConditionItem,
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from '@/components/styled'
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
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Table,
  Tooltip,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const BookPage = () => {
  const { modal } = App.useApp()
  const { t } = useTranslation()
  const [queryForm] = Form.useForm()
  const navigate = useNavigate()
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [booksData, setBooksData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [queryCriteria, setQueryCriteria] = useState()
  const [loading, setLoading] = useState(false)

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const fetchBooks = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/books?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.bookName) {
      searchURL += `&bookName=${queryCriteria.bookName}`
    }
    if (queryCriteria?.author) {
      searchURL += `&author=${queryCriteria.author}`
    }
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
  }, [pageNumber, pageSize, queryCriteria?.author, queryCriteria?.bookName, t])

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/books/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              setChangeTimestamp(Date.now())
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
    const queryValue = queryForm.getFieldsValue()
    setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  const handleCreateAction = () => {
    navigate('/books/form')
  }

  const handleEditAction = (id) => {
    navigate(`/books/${id}/form`)
  }

  const handleViewAction = (id) => {
    navigate(`/books/${id}/view`)
  }

  const handleLinkToChapterAction = (book) => {
    navigate(`/books/${book.id}/chapters`)
  }

  const handleLinkToCourseAction = (book) => {
    navigate(`/books/${book.id}/courses`)
  }

  const handleLinkToQRCodeAction = (book) => {
    navigate(`/books/${book.id}/qrcodes`)
  }

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks, pageNumber, changeTimestamp])

  return (
    <Card title={t('title.book')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label={t('title.name')} name="bookName">
              <Input placeholder={t('message.placeholder.name')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.author')} name="author">
              <Input placeholder={t('message.placeholder.bookAuthor')} />
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
              key: 'bookImgUrl',
              dataIndex: 'bookImgUrl',
              render: (text) => <Image height={50} src={text} />,
            },
            {
              title: `${t('title.name')}`,
              key: 'bookName',
              dataIndex: 'bookName',
              width: 150,
              render: (text, record) => (
                <Button onClick={() => handleViewAction(record.id)} type="link">
                  <Tooltip title={record.introduction} color="#2db7f5">
                    {text}
                  </Tooltip>
                </Button>
              ),
            },
            {
              title: `${t('title.author')}`,
              key: 'author',
              dataIndex: 'author',
            },
            {
              title: `${t('title.classification')}`,
              key: 'classifications',
              render: (text, record) => {
                return <span>{record.classifications.join(', ')}</span>
              },
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    <Button
                      onClick={() => handleLinkToChapterAction(record)}
                      type="link"
                    >
                      {t('button.Chapter')}({record.chapterCount})
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      onClick={() => handleLinkToCourseAction(record)}
                      type="link"
                    >
                      {t('button.course')}({record.courseCount})
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      onClick={() => handleLinkToQRCodeAction(record)}
                      type="link"
                    >
                      {t('button.qrcode')}({record.qrcodeCount})
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      type="link"
                      onClick={() => handleEditAction(record.id)}
                    >
                      {t('button.edit')}
                    </Button>
                    {record.chapterCount === 0 && record.courseCount === 0 && (
                      <>
                        <Divider type="vertical" />
                        <Button
                          type="link"
                          danger
                          onClick={() => handleDeleteAction(record.id)}
                        >
                          {t('button.delete')}
                        </Button>
                      </>
                    )}
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
  )
}

export default BookPage
