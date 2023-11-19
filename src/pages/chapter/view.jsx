import ViewItem from '@/components/view-item'
import useFetch from '@/hooks/useFetch'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Image, Row, Skeleton, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'

const ChapterView = () => {
  const { t } = useTranslation()
  const params = useParams()
  const queryId = params?.id
  const bookId = params?.bookId
  const navigate = useNavigate()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)

  const { fetchedData } = useFetch(`/api/admin/v1/books/${bookId}`, [])

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/chapters/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setInitFormData({
            ...resultData,
          })
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
  }, [queryId, t])

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <Card
      title={
        <>
          <Button
            type="link"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(`/books/${bookId}/chapters`)}
          />
          《{fetchedData?.bookName}》- {t('title.content.view')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Row>
            <Col span={12}>
              <ViewItem
                label={t('title.chapterNo')}
                value={initFormData?.chapterNo}
              />
              <ViewItem
                label={t('title.chapterName')}
                value={initFormData?.chapterName}
              />
              <ViewItem
                label={t('title.image')}
                value={
                  <Image
                    src={initFormData?.coverImgUrl}
                    alt="coverImg"
                    style={{ height: 200 }}
                  />
                }
              />
              <ViewItem
                label={t('title.audio')}
                value={
                  <ReactPlayer
                    url={initFormData?.audioUrl}
                    // url="https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3"
                    width={'100%'}
                    height={50}
                    controls={true}
                    config={{
                      file: {
                        forceAudio: true,
                      },
                    }}
                  />
                }
              />
              <ViewItem
                label={t('title.description')}
                value={initFormData?.description}
              />
            </Col>
          </Row>
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default ChapterView
