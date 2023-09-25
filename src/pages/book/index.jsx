import {
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import { Routes } from '@/libs/router'
import axios from 'axios'
import {
  ConditionItem,
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import i18n from '@/locales/i18n'

const { confirm } = Modal

const BookPage = () => {
  const [queryForm] = Form.useForm()
  const navigate = useNavigate()
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [booksData, setBooksData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [queryCriteria, setQueryCriteria] = useState()
  const [loading, setLoading] = useState(false)
  const [chapterCount, setChapterCount] = useState()

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const loadChapterCountByBook = (bookIds) => {
    axios
      .get(`/api/admin/v1/books/${bookIds}/chapter-count`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const bookAndChapterCount = res.data
          setChapterCount(bookAndChapterCount)
        }
      })
      .catch((err) =>
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        ),
      )
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
          if (responseObject.records) {
            loadChapterCountByBook(
              responseObject.records.flatMap((book) => book.id),
            )
          }
        }
      })
      .catch((err) =>
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryCriteria?.author, queryCriteria?.bookName])

  const handleDeleteAction = (id) => {
    confirm({
      title: '确定删除当前记录？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        axios
          .delete(`/api/admin/v1/books/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success('归档成功!')
            }
          })
          .catch((err) => {
            message.error(
              `${i18n.t('message.error.failureReason')}${
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
    navigate(Routes.BOOK_FORM.path)
  }

  const handleEditAction = (id) => {
    navigate(`${Routes.BOOK_FORM.path}?id=${id}`)
  }

  const handleViewAction = (id) => {
    navigate(`${Routes.BOOK_VIEW.path}?id=${id}`)
  }

  const handleLinkToChapterAction = (id, bookName) => {
    navigate(`${Routes.CHAPTER_LIST.path}?id=${id}&name=${bookName}`)
  }

  const handleStatusChange = (id, status) => {
    const cCount = chapterCount?.find((cc) => cc.bookId === id)?.chapterCount
    if (!cCount) {
      message.error(`${i18n.t('message.error.noBookChapters')}`)
      return
    }
    axios.put(`/api/admin/v1/books/${id}/status/${status}`).then((res) => {
      if (res.status === HttpStatus.OK) {
        const timestamp = new Date().getTime()
        setChangeTimestamp(timestamp)
        message.success(i18n.t('message.successInfo'))
      }
    })
  }

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks, pageNumber, changeTimestamp])

  return (
    <Card title={i18n.t('title.book')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label={i18n.t('title.name')} name="bookName">
              <Input placeholder={i18n.t('message.placeholder.bookName')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={i18n.t('title.author')} name="author">
              <Input placeholder={i18n.t('message.placeholder.bookAuthor')} />
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
                {i18n.t('button.create')}
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
                {i18n.t('button.reset')}
              </Button>
            </ConditionLeftItem>
            <ConditionLeftItem>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                onClick={handleQuery}
              >
                {i18n.t('button.search')}
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
              title: '名称',
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
              title: '作者',
              key: 'author',
              dataIndex: 'author',
            },
            {
              title: '封面',
              key: 'coverImg',
              dataIndex: 'coverImg',
              render: (text) => <Image width={50} src={text} />,
            },
            {
              title: '连载',
              key: 'isSerialized',
              dataIndex: 'isSerialized',
              render: (text) => (text ? '是' : '否'),
            },
            {
              title: '完结',
              key: 'hasEnding',
              dataIndex: 'hasEnding',
              render: (text) => (text ? '是' : '否'),
            },
            {
              title: '状态',
              key: 'status',
              dataIndex: 'status',
              render: (text) => {
                return text === 'ONLINE' ? (
                  <Tag color="green">已上架</Tag>
                ) : (
                  <Tag color="red">未上架</Tag>
                )
              },
            },
            {
              title: '操作',
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    {record.status === 'ONLINE' ? (
                      <Button
                        onClick={() => handleStatusChange(record.id, 'OFFLINE')}
                        type="link"
                      >
                        {i18n.t('button.OffShelf')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStatusChange(record.id, 'ONLINE')}
                        type="link"
                      >
                        {i18n.t('button.grounding')}
                      </Button>
                    )}

                    <Divider type="vertical" />
                    <Button
                      onClick={() =>
                        handleLinkToChapterAction(record.id, record.bookName)
                      }
                      type="link"
                    >
                      {i18n.t('button.Chapter')}(
                      {chapterCount?.find((cc) => cc.bookId === record.id)
                        ?.chapterCount || 0}
                      )
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      type="link"
                      onClick={() => handleEditAction(record.id)}
                    >
                      {i18n.t('button.edit')}
                    </Button>

                    <Divider type="vertical" />
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteAction(record.id)}
                    >
                      {i18n.t('button.delete')}
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
  )
}

export default BookPage
