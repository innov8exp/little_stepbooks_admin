import {
  ExclamationCircleOutlined,
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
} from 'antd'
// import { Routes } from "../../common/config";
import axios from 'axios'
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
// import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

const CommentPage = () => {
  const { t } = useTranslation()
  const [queryForm] = Form.useForm()
  //   const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [commentsData, setCommentsData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [setQueryCriteria] = useState()

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const fetchData = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/comments/search?currentPage=${pageNumber}&pageSize=${pageSize}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setCommentsData(responseObject.records)
          setTotal(responseObject.total)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize])

  const handleDeleteAction = (id) => {
    confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/comments/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              setChangeTimestamp(Date.now())
              message.success(t('message.successInfo'))
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

  // const handleEditAction = (id) => {
  //     history.push(`${Routes.main.routes.bookForm.path}?id=${id}`);
  // };

  useEffect(() => {
    fetchData()
  }, [fetchData, pageNumber, changeTimestamp])

  return (
    <Card title={t('title.comment')}>
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
            <Form.Item label={t('title.label.userName')} name="nickname">
              <Input placeholder={t('message.placeholder.enterUserName')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider style={{ marginTop: 0, marginBottom: 10 }} dashed />
      <ContentContainer>
        <StyledRightCondition>
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
        </StyledRightCondition>
        <Table
          columns={[
            {
              title: '#',
              key: 'number',
              render: (text, record, index) =>
                (pageNumber - 1) * pageSize + index + 1,
            },
            {
              title: `${t('title.label.userNickName')}`,
              key: 'username',
              dataIndex: 'username',
            },
            {
              title: `${t('title.userNickname')}`,
              key: 'nickname',
              dataIndex: 'nickname',
            },
            {
              title: `${t('title.userProfile')}`,
              key: 'avatarImg',
              dataIndex: 'avatarImg',
              render: (text) => <Image width={30} src={text} />,
            },
            {
              title: `${t('title.label.course')}`,
              key: 'course',
              dataIndex: 'course',
            },
            {
              title: `${t('title.commentContent')}`,
              key: 'content',
              dataIndex: 'content',
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => {
                return (
                  <div>
                    {/* <Button
                                            type="link"
                                            onClick={() =>
                                                handleEditAction(record.id)
                                            }
                                        >
                                            编辑
                                        </Button> */}

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
          dataSource={commentsData}
          loading={loading}
          pagination={paginationProps}
        />
      </ContentContainer>
    </Card>
  )
}

export default CommentPage
