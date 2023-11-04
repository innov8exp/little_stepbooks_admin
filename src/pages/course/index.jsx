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
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

const CoursePage = () => {
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
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
  }

  const fetchCourses = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/courses`
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
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryCriteria?.author, queryCriteria?.bookName])

  const handleDeleteAction = (id) => {
    confirm({
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
    const queryValue = queryForm.getFieldsValue()
    setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  const handleCreateAction = () => {
    navigate(Routes.COURSE_FORM.path)
  }

  const handleEditAction = (id) => {
    navigate(`${Routes.COURSE_FORM.path}?id=${id}`)
  }

  const handleViewAction = (id) => {
    navigate(`${Routes.BOOK_VIEW.path}?id=${id}`)
  }

  const handleLinkToChapterAction = (id, bookName) => {
    navigate(`${Routes.CHAPTER_LIST.path}?id=${id}&name=${bookName}`)
  }

  // const handleStatusChange = (id, status) => {
  //   const cCount = chapterCount?.find((cc) => cc.bookId === id)?.chapterCount
  //   if (!cCount) {
  //     message.error(`${t('message.error.noBookChapters')}`)
  //     return
  //   }
  //   axios.put(`/api/admin/v1/books/${id}/status/${status}`).then((res) => {
  //     if (res.status === HttpStatus.OK) {
  //       const timestamp = new Date().getTime()
  //       setChangeTimestamp(timestamp)
  //       message.success(t('message.successInfo'))
  //     }
  //   })
  // }

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses, pageNumber, changeTimestamp])

  return (
    <Card title={t('title.course')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label={t('title.courseName')} name="courseName">
              <Input placeholder={t('message.placeholder.courseName')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.lecturer')} name="author">
              <Input placeholder={t('message.placeholder.lecturer')} />
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
              render: (text) => <Image width={50} src={text} />,
            },
            {
              title: `${t('title.courseName')}`,
              key: 'name',
              dataIndex: 'name',
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
              title: `${t('title.lecturer')}`,
              key: 'author',
              dataIndex: 'author',
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    {/* {record.status === 'ONLINE' ? (
                      <Button
                        onClick={() => handleStatusChange(record.id, 'OFFLINE')}
                        type="link"
                      >
                        {t('button.OffShelf')}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStatusChange(record.id, 'ONLINE')}
                        type="link"
                      >
                        {t('button.grounding')}
                      </Button>
                    )}

                    <Divider type="vertical" /> */}
                    <Button
                      onClick={() =>
                        handleLinkToChapterAction(record.id, record.bookName)
                      }
                      type="link"
                    >
                      {t('button.Chapter')}(
                      {chapterCount?.find((cc) => cc.bookId === record.id)
                        ?.chapterCount || 0}
                      )
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      type="link"
                      onClick={() => handleEditAction(record.id)}
                    >
                      {t('button.edit')}
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
  )
}

export default CoursePage
