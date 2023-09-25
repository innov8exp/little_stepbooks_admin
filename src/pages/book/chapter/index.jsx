import {
  ExclamationCircleOutlined,
  LeftCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, Card, Divider, message, Modal, Switch, Table } from 'antd'
import { Routes } from '@/libs/router'
import axios from 'axios'
import useQuery from '@/hooks/useQuery'
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
import styled from 'styled-components'
import ChapterView from './view'
import UploadForm from './form'
import i18n from '@/locales/i18n'

const { confirm } = Modal

const CustomLink = styled.a`
  margin-right: 20px;
`

const ChapterPage = () => {
  const navigate = useNavigate()
  const query = useQuery()
  const queryId = query.get('id')
  const queryName = query.get('name')
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [chaptersData, setChaptersData] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  // const [queryCriteria, setQueryCriteria] = useState<BookQuery>();
  const [loading, setLoading] = useState(false)
  const [uploadFormVisible, setUploadFormVisible] = useState(false)
  const [chapterViewVisible, setChapterViewVisible] = useState(false)
  const [chapterId, setChapterId] = useState()

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    },
  }

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/chapters?bookId=${queryId}&currentPage=${pageNumber}&pageSize=${pageSize}`
    // if (queryCriteria?.bookName) {
    //     searchURL += `&bookName=${queryCriteria.bookName}`;
    // }
    // if (queryCriteria?.author) {
    //     searchURL += `&author=${queryCriteria.author}`;
    // }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setChaptersData(responseObject.records)
          setTotal(responseObject.total)
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
  }, [pageNumber, pageSize, queryId])

  const handleDeleteAction = (id) => {
    confirm({
      title: `${i18n.t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${i18n.t('button.determine')}`,
      okType: 'primary',
      cancelText: `${i18n.t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/chapters/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
              message.success(i18n.t('message.successInfo'))
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
  }

  const handleCreateAction = () => {
    navigate(`${Routes.CHAPTER_FORM.path}?bookId=${queryId}`)
  }

  const handleEditAction = (id) => {
    navigate(`${Routes.CHAPTER_FORM.path}?bookId=${queryId}&id=${id}`)
  }

  const handleViewAction = (id) => {
    setChapterId(id)
    setChapterViewVisible(true)
  }

  const handleUploadAction = () => {
    setUploadFormVisible(true)
  }

  const handleSwitchChange = (id, checked) => {
    setLoading(true)
    axios
      .put(`/api/admin/v1/chapters/${id}/payment-type`, {
        needPay: checked,
      })
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          message.success(`操作成功`)
        }
      })
      .catch((err) =>
        message.error(
          `${i18n.t('message.error.failureReason')}${
            err.response?.data?.message
          }`,
        ),
      )
      .finally(() => {
        setLoading(false)
        handleQuery()
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, pageNumber, changeTimestamp])

  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate.goBack()}
          />
          《{queryName}》- {i18n.t('button.Chapter')}
        </>
      }
    >
      <ContentContainer>
        <StyledCondition>
          <QueryBtnWrapper>
            <ConditionItem>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => handleCreateAction()}
              >
                {i18n.t('button.newChapter')}
              </Button>
            </ConditionItem>
            <ConditionItem>
              <Button
                icon={<UploadOutlined />}
                type="primary"
                onClick={() => handleUploadAction()}
              >
                {i18n.t('button.uploadChapter')}
              </Button>
            </ConditionItem>
            <ConditionItem>
              <CustomLink href="/api/admin/v1/chapters/template/download">
                {i18n.t('button.templateDownload')}
              </CustomLink>
            </ConditionItem>
          </QueryBtnWrapper>
          <QueryBtnWrapper>
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
            // {
            //     title: '#',
            //     key: 'number',
            //     render: (text, record, index) =>
            //         (pageNumber - 1) * pageSize + index + 1,
            // },
            {
              title: '章节序号',
              key: 'chapterNumber',
              dataIndex: 'chapterNumber',
            },
            {
              title: '章节名称',
              key: 'chapterName',
              dataIndex: 'chapterName',
            },
            {
              title: '章节介绍',
              key: 'introduction',
              dataIndex: 'introduction',
            },
            {
              title: '是否付费',
              key: 'needPay',
              dataIndex: 'needPay',
              render: (text, record) => (
                <Switch
                  onChange={(checked) => handleSwitchChange(record.id, checked)}
                  checkedChildren="付费"
                  unCheckedChildren="免费"
                  checked={text}
                />
              ),
            },
            // {
            //     title: '章节内容地址',
            //     key: 'contentLink',
            //     dataIndex: 'contentLink',
            // },
            {
              title: '创建时间',
              key: 'createdAt',
              dataIndex: 'createdAt',
            },
            {
              title: '更新时间',
              key: 'modifiedAt',
              dataIndex: 'modifiedAt',
            },
            {
              title: '操作',
              key: 'action',
              render: (text, record) => (
                <div>
                  <Button
                    onClick={() => handleViewAction(record.id)}
                    type="link"
                  >
                    {i18n.t('button.preview')}
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
              ),
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={chaptersData}
          loading={loading}
          pagination={paginationProps}
        />
      </ContentContainer>
      <UploadForm
        bookId={queryId}
        visible={uploadFormVisible}
        onCancel={() => {
          setUploadFormVisible(false)
          handleQuery()
        }}
        onOk={() => {
          setUploadFormVisible(false)
          const timestamp = new Date().getTime()
          setChangeTimestamp(timestamp)
        }}
      />
      <ChapterView
        id={chapterId}
        visible={chapterViewVisible}
        onClose={() => {
          setChapterViewVisible(false)
          handleQuery()
        }}
      />
    </Card>
  )
}

export default ChapterPage
