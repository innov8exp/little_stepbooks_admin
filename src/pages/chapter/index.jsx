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
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { App, Button, Card, Divider, Table, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

const ChapterPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const params = useParams()
  const bookId = params?.bookId
  const [changeTimestamp, setChangeTimestamp] = useState()
  const [chaptersData, setChaptersData] = useState()
  // const [queryCriteria, setQueryCriteria] = useState<BookQuery>();
  const [loading, setLoading] = useState(false)

  const { fetchedData } = useFetch(`/api/admin/v1/books/${bookId}`, [])

  const fetchChapters = useCallback(() => {
    setLoading(true)
    const searchURL = `/api/admin/v1/books/${bookId}/chapters`
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
  }, [bookId, t])

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
    navigate(`/books/${bookId}/chapters/form`)
  }

  const handleEditAction = (id) => {
    navigate(`/books/${bookId}/chapters/${id}/form`)
  }

  const handleViewAction = (id) => {
    navigate(`/books/${bookId}/chapters/${id}/view`)
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
            onClick={() => navigate(`/books`)}
          />
          《{fetchedData?.bookName}》- {t('title.content')}
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
