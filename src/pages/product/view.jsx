import ViewItem from '@/components/view-item'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import { formatMoney } from '@/libs/util'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Image, Skeleton, Space, message } from 'antd'
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
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)

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
              onClick={() => navigate(Routes.PRODUCT_LIST.path)}
            />
            {t('button.productEditing')}
          </>
        }
      >
        {isDisplayForm ? (
          <Skeleton loading={loading} active>
            <ViewItem
              label={t('title.skuCode')}
              value={initFormData?.skuCode}
            />
            <ViewItem
              label={t('title.skuName')}
              value={initFormData?.skuName}
            />
            <ViewItem
              label={t('title.describe')}
              value={initFormData?.description}
            />
            <ViewItem
              label={t('title.salesPlatform')}
              value={initFormData?.salesPlatforms?.map((item) => item)}
            />
            <ViewItem
              label={t('title.productNature')}
              value={t(initFormData?.productNature)}
            />
            <ViewItem
              label={t('title.bookSetName')}
              value={t(initFormData?.bookSetName)}
            />
            <ViewItem
              label={t('title.material')}
              value={t(initFormData?.materials?.map((item) => item))}
            />
            <ViewItem
              label={t('title.price')}
              value={formatMoney(initFormData?.price)}
            />
            <ViewItem
              label={t('title.cover')}
              value={<Image src={initFormData?.coverImgUrl} />}
            />
            <ViewItem
              label={t('title.cover')}
              value={initFormData?.medias?.map((item) => (
                <Space key={item?.id}>
                  <Image src={item?.objectUrl} />
                </Space>
              ))}
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
