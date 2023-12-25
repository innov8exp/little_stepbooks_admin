import ViewItem from '@/components/view-item'
import useQuery from '@/hooks/useQuery'
import { formatMoney } from '@/libs/util'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Image, Row, Skeleton, message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const ProductView = () => {
  const { t } = useTranslation()
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [initFormData, setInitFormData] = useState()
  const [books, setBooks] = useState()
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)

  const fetchProductBooks = async (productId) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/admin/v1/products/${productId}/books`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const books = res.data
            resolve(books)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/products/${queryId}`)
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

    fetchProductBooks(queryId).then((res) => {
      setBooks(res)
    })
  }, [queryId, t])

  useEffect(() => {
    initData()
  }, [initData])

  return (
    <>
      <Card
        title={
          <>
            <Button
              type="link"
              size="large"
              icon={<LeftCircleOutlined />}
              onClick={() => navigate(-1)}
            />
            {t('button.productView')}
          </>
        }
      >
        {isDisplayForm ? (
          <Skeleton loading={loading} active>
            <ViewItem
              labelSpan={4}
              label={t('title.skuCode')}
              value={initFormData?.skuCode}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.skuName')}
              value={initFormData?.skuName}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.describe')}
              value={initFormData?.description}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.salesPlatforms')}
              value={initFormData?.parsedSalesPlatforms
                ?.map((item) => t(item))
                .join(', ')}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.productNature')}
              value={t(initFormData?.productNature)}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.classification')}
              value={initFormData?.classificationNames?.join(', ')}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.books')}
              value={
                '《' +
                t(books?.map((item) => item?.bookName).join('》《')) +
                '》'
              }
            />
            <ViewItem
              labelSpan={4}
              label={t('title.materials')}
              value={initFormData?.parsedMaterials
                ?.map((item) => t(item))
                .join(', ')}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.price')}
              value={formatMoney(initFormData?.price)}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.cover')}
              value={<Image src={initFormData?.coverImgUrl} width={300} />}
            />
            <ViewItem
              labelSpan={4}
              label={t('title.media')}
              value={initFormData?.medias?.map((item) => {
                return (
                  <Row key={item?.mediaId}>
                    <Col>
                      <Image src={item?.mediaUrl} width={300} />
                    </Col>
                  </Row>
                )
              })}
            />
          </Skeleton>
        ) : (
          <Empty description={<span>{t('message.error.failure')}</span>} />
        )}
      </Card>
    </>
  )
}

export default ProductView
