import {
  ConditionItem,
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledCondition,
} from '@/components/styled'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import {
  ExclamationCircleOutlined,
  LeftCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Card, Divider, Table, message, App, Image } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const ChapterPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const query = useQuery()
  const queryId = query.get('id')
  const queryName = query.get('name')
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [chaptersData, setChaptersData] = useState()
  // const [queryCriteria, setQueryCriteria] = useState<BookQuery>();
  const [loading, setLoading] = useState(false)

  const [setChapterViewVisible] = useState(false)
  const [setChapterId] = useState()

  const fetchChapters = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/books/${queryId}/chapters`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setChaptersData(responseObject)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [queryId, t])

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/chapters/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              const timestamp = new Date().getTime()
              setChangeTimestamp(timestamp)
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

  useEffect(() => {
    fetchChapters()
  }, [fetchChapters, changeTimestamp])

  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(Routes.BOOK_LIST.path)}
          />
          《{queryName}》- {t('title.content')}
        </>
      }
    >
      <ContentContainer>
        <StyledCondition>
          <QueryBtnWrapper>
            <ConditionItem>
              <Button type="primary" onClick={() => handleCreateAction()}>
                {t('button.create')}
              </Button>
            </ConditionItem>
          </QueryBtnWrapper>
          <QueryBtnWrapper>
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
              title: `${t('title.chapterNo')}`,
              key: 'chapterNo',
              dataIndex: 'chapterNo',
            },
            {
              title: `${t('title.chapterName')}`,
              key: 'chapterName',
              dataIndex: 'chapterName',
            },
            {
              title: `${t('title.cover')}`,
              key: 'img',
              dataIndex: 'img',
              render: (text) => <Image width={100} alt="image" src={text} />,
            },
            {
              title: `${t('title.chapterIntroduction')}`,
              key: 'description',
              dataIndex: 'description',
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              render: (text, record) => (
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
              ),
            },
          ]}
          rowKey={(record) => record.id}
          pagination={false}
          dataSource={chaptersData}
          loading={loading}
        />
      </ContentContainer>
    </Card>
  )
}

export default ChapterPage
