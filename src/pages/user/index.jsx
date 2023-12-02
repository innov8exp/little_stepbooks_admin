import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from '@/components/styled'
import {
  ExclamationCircleOutlined,
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
  Row,
  Table,
  Tag,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const UserPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [changeTime, setChangeTime] = useState(Date.now())
  const [fetchedData, setFetchedData] = useState([])
  const [queryCriteria, setQueryCriteria] = useState()
  const [loading, setLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [queryForm] = Form.useForm()

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const loadData = useCallback(() => {
    setLoading(true)
    axios
      .get(
        `/api/admin/v1/users?currentPage=${pageNumber}&pageSize=${pageSize}`,
        { params: queryCriteria },
      )
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setFetchedData(resultData.records)
          setTotal(resultData.total)
        }
      })
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryCriteria])

  const handleChangeStatusAction = (id, active) => {
    modal.confirm({
      title: `${t('message.tips.changeStatus')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/users/${id}`, { active })
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

  const handleQuery = () => {
    const timestamp = new Date().getTime()
    setChangeTime(timestamp)
    const queryValue = queryForm.getFieldsValue()
    setQueryCriteria(queryValue)
  }

  const handleReset = () => {
    queryForm.resetFields()
  }

  useEffect(() => {
    loadData()
  }, [loadData, changeTime])

  return (
    <Card title={t('title.userManagement')}>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: '', status: '' }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label={t('title.label.userNickName')} name="username">
              <Input placeholder={t('message.placeholder.enterUserName')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('title.nickname')} name="nickname">
              <Input placeholder={t('message.placeholder.nickname')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider style={{ marginTop: 0, marginBottom: 10 }} dashed />
      <ContentContainer>
        <StyledCondition>
          <QueryBtnWrapper></QueryBtnWrapper>
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
              title: `${t('title.label.userNickName')}`,
              key: 'username',
              dataIndex: 'username',
            },
            {
              title: `${t('title.userNickname')}`,
              key: 'nickname',
              dataIndex: 'nickname',
            },
            // {
            //   title: `${t('title.email')}`,
            //   key: 'email',
            //   dataIndex: 'email',
            // },
            {
              title: 'WechatID',
              key: 'wechatId',
              dataIndex: 'wechatId',
            },
            {
              title: `${t('title.phone')}`,
              key: 'phone',
              dataIndex: 'phone',
            },
            // {
            //   title: `${t('title.deviceId')}`,
            //   key: 'deviceId',
            //   dataIndex: 'deviceId',
            // },
            {
              title: `${t('title.gender')}`,
              key: 'childrenGender',
              dataIndex: 'childrenGender',
            },
            {
              title: `${t('title.creationTime')}`,
              key: 'createdAt',
              dataIndex: 'createdAt',
            },
            {
              title: `${t('title.status')}`,
              key: 'active',
              dataIndex: 'active',
              render: (text) =>
                text ? (
                  <Tag color="green">{t('title.status.normal')}</Tag>
                ) : (
                  <Tag color="red">{t('title.status.disable')}</Tag>
                ),
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              width: 200,
              render: (text, record) => {
                return record.active ? (
                  <Button
                    onClick={() => handleChangeStatusAction(record.id, false)}
                    danger
                    type="link"
                  >
                    {t('button.disable')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleChangeStatusAction(record.id, true)}
                    danger
                    type="link"
                  >
                    {t('button.enable')}
                  </Button>
                )
              },
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={fetchedData}
          pagination={paginationProps}
          loading={loading}
        />
      </ContentContainer>
    </Card>
  )
}

export default UserPage
