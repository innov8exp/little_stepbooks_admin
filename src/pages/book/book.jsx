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
import { Routes } from 'src/common/config'
import axios from 'src/common/network'
import {
  ConditionItem,
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from 'src/components/styled'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
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
              responseObject.records.flatMap((book) => book.id)
            )
          }
        }
      })
      .catch((err) =>
        message.error(`操作失败，原因：${err.response?.data?.message}`)
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
            message.error(`操作失败，原因：${err.response?.data?.message}`)
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
    navigate(Routes.main.routes.bookForm.path)
  }

  const handleEditAction = (id) => {
    navigate(`${Routes.main.routes.bookForm.path}?id=${id}`)
  }

  const handleViewAction = (id) => {
    navigate(`${Routes.main.routes.bookView.path}?id=${id}`)
  }

  const handleLinkToChapterAction = (id, bookName) => {
    navigate(`${Routes.main.routes.chapter.path}?id=${id}&name=${bookName}`)
  }

  const handleStatusChange = (id, status) => {
    const cCount = chapterCount?.find((cc) => cc.bookId === id)?.chapterCount
    if (!cCount) {
      message.error('未发现书籍章节，请上传书籍章节！')
      return
    }
    axios.put(`/api/admin/v1/books/${id}/status/${status}`).then((res) => {
      if (res.status === HttpStatus.OK) {
        const timestamp = new Date().getTime()
        setChangeTimestamp(timestamp)
        message.success('操作成功!')
      }
    })
  }

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks, pageNumber, changeTimestamp])

  return (
    <Card title='小说管理'>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}>
        <Row>
          <Col span={6}>
            <Form.Item label='名称' name='bookName'>
              <Input placeholder='请输入小说名称' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='作者' name='author'>
              <Input placeholder='请输入小说作者' />
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
                type='primary'
                onClick={() => handleCreateAction()}>
                新建
              </Button>
            </ConditionItem>
          </QueryBtnWrapper>
          <QueryBtnWrapper>
            <ConditionLeftItem>
              <Button
                icon={<UndoOutlined />}
                type='default'
                onClick={handleReset}>
                重置
              </Button>
            </ConditionLeftItem>
            <ConditionLeftItem>
              <Button
                icon={<SearchOutlined />}
                type='primary'
                onClick={handleQuery}>
                查询
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
                <Button onClick={() => handleViewAction(record.id)} type='link'>
                  <Tooltip title={record.introduction} color='#2db7f5'>
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
                  <Tag color='green'>已上架</Tag>
                ) : (
                  <Tag color='red'>未上架</Tag>
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
                        type='link'>
                        下架
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStatusChange(record.id, 'ONLINE')}
                        type='link'>
                        上架
                      </Button>
                    )}

                    <Divider type='vertical' />
                    <Button
                      onClick={() =>
                        handleLinkToChapterAction(record.id, record.bookName)
                      }
                      type='link'>
                      章节管理(
                      {chapterCount?.find((cc) => cc.bookId === record.id)
                        ?.chapterCount || 0}
                      )
                    </Button>
                    <Divider type='vertical' />
                    <Button
                      type='link'
                      onClick={() => handleEditAction(record.id)}>
                      编辑
                    </Button>

                    <Divider type='vertical' />
                    <Button
                      type='link'
                      danger
                      onClick={() => handleDeleteAction(record.id)}>
                      删除
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
