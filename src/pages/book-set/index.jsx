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
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  App,
  Row,
  Table,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const BookSetPage = () => {
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

  const fetchBookSets = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/book-sets?currentPage=${pageNumber}&pageSize=${pageSize}`
    if (queryCriteria?.code) {
      searchURL += `&code=${queryCriteria.code}`
    }
    if (queryCriteria?.name) {
      searchURL += `&name=${queryCriteria.name}`
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
  }, [pageNumber, pageSize, queryCriteria?.name, queryCriteria?.code, t])

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/book-sets/${id}`)
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
    navigate(Routes.BOOK_SET_FORM.path)
  }

  const handleEditAction = (id) => {
    navigate(`${Routes.BOOK_SET_FORM.path}?id=${id}`)
  }

  const handleViewAction = (id) => {
    navigate(`${Routes.BOOK_SET_VIEW.path}?id=${id}`)
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
    fetchBookSets()
  }, [fetchBookSets, pageNumber, changeTimestamp])

  return (
    <Card title={t('title.bookSet')}>
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
          <Col span={6}>
            <Form.Item label={t('title.name')} name="name">
              <Input placeholder={t('message.placeholder.name')} />
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
              key: 'code',
              dataIndex: 'code',
              render: (text, record) => (
                <Button onClick={() => handleViewAction(record.id)} type="link">
                  {text}
                </Button>
              ),
            },
            {
              title: `${t('title.name')}`,
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: `${t('title.description')}`,
              key: 'description',
              dataIndex: 'description',
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
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

export default BookSetPage
