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
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  App,
  Row,
  Table,
  Tag,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

const CoursePage = () => {
  const { t } = useTranslation()
  const [queryForm] = Form.useForm()
  const params = useParams()
  const bookId = params?.bookId
  const navigate = useNavigate()
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [courses, setCourses] = useState()
  const [queryCriteria, setQueryCriteria] = useState()
  const [loading, setLoading] = useState(false)
  const { modal } = App.useApp()

  const { fetchedData } = useFetch(`/api/admin/v1/books/${bookId}`, [])

  const fetchCourses = useCallback(() => {
    setLoading(true)
    let searchURL = `/api/admin/v1/books/${bookId}/courses`
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
          setCourses([...responseObject])
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [queryCriteria?.author, queryCriteria?.bookName, t, bookId])

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/courses/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success(`${t('message.archiveSuccessful')}`)
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(
              `${t('message.error.failureReason')} 已绑定产品，不能删除!`,
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
    navigate(`/books/${bookId}/courses/form`)
  }

  const handleEditAction = (id) => {
    navigate(`/books/${bookId}/courses/${id}/form`)
  }

  const handleViewAction = (id) => {
    navigate(`/books/${bookId}/courses/${id}/view`)
  }

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses, changeTimestamp])

  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(`/books`)}
          />
          《{fetchedData?.bookName}》- {t('title.course')}
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
              render: (text, record, index) => index + 1,
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
            },
            {
              title: `${t('title.lecturer')}`,
              key: 'author',
              dataIndex: 'author',
            },
            {
              title: `${t('title.courseNature')}`,
              key: 'courseNature',
              dataIndex: 'courseNature',
              render: (text) =>
                text === 'TRIAL' ? (
                  <Tag color="blue">{t('title.trial')}</Tag>
                ) : (
                  <Tag color="blue">{t('title.needToPay')}</Tag>
                ),
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    <Button
                      onClick={() => handleViewAction(record.id)}
                      type="link"
                    >
                      {t('button.preview')}
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
          dataSource={courses}
          loading={loading}
          pagination={false}
        />
      </ContentContainer>
    </Card>
  )
}

export default CoursePage
