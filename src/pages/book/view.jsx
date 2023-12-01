import ViewItem from '@/components/view-item'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Empty, message, Skeleton, Image } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

const BookView = () => {
  const { t } = useTranslation()
  const params = useParams()
  const queryId = params?.id
  const navigate = useNavigate()
  const [initFormData, setInitFormData] = useState({
    isSerialized: false,
    hasEnding: true,
  })
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(false)

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/books/${queryId}`)
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
          {t('title.bookViewing')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <ViewItem
            label={t('title.bookName')}
            value={initFormData?.bookName}
          />
          <ViewItem label={t('title.author')} value={initFormData?.author} />
          <ViewItem
            label={t('title.duration')}
            value={initFormData?.duration}
          />
          <ViewItem
            label={t('title.classification')}
            value={initFormData?.classifications?.join(', ')}
          />
          <ViewItem
            label={t('title.bookIntroduction')}
            value={initFormData?.description}
          />
          <ViewItem
            label={t('title.cover')}
            value={
              <Image
                src={initFormData?.bookImgUrl}
                alt="封面图片"
                style={{ height: 200 }}
              />
            }
          />
          {initFormData?.medias?.map((item, index) => (
            <ViewItem
              key={index}
              label={t('title.media')}
              value={<Image src={item?.mediaUrl} style={{ height: 200 }} />}
            />
          ))}
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default BookView
