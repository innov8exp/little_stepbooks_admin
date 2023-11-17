import ViewItem from '@/components/view-item'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Image, message, Skeleton, Row, Col } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'

const BookView = () => {
  const { t } = useTranslation()
  const params = useParams()
  const queryId = params?.id
  const navigate = useNavigate()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/courses/${queryId}`)
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
            onClick={() => navigate(-1)}
          />
          {t('title.courseView')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Row>
            <Col span={12}>
              <ViewItem label={t('title.name')} value={initFormData?.name} />
              <ViewItem
                label={t('title.courseNature')}
                value={initFormData?.courseNature}
              />
              <ViewItem
                label={t('title.description')}
                value={initFormData?.description}
              />
              <ViewItem
                label={t('title.author')}
                value={initFormData?.author}
              />
              <ViewItem
                label={t('title.authorIntroduction')}
                value={initFormData?.authorIntroduction}
              />
              <ViewItem
                label={t('title.duration')}
                value={initFormData?.duration}
              />
              <ViewItem
                label={t('title.cover')}
                value={
                  <Image
                    src={initFormData?.coverImgUrl}
                    alt="coverImg"
                    style={{ height: 200 }}
                  />
                }
              />
              <ViewItem
                label={t('title.video')}
                value={
                  <ReactPlayer
                    url={initFormData?.videoUrl}
                    width={350}
                    height={200}
                    controls={true}
                    light={true}
                    style={{ backgroundColor: '#cccccc' }}
                  />
                }
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

export default BookView
