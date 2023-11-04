import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Empty, Form, message, Skeleton } from 'antd'
import { Routes } from '@/libs/router'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import useQuery from '@/hooks/useQuery'
import ViewItem from '@/components/view-item'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BookView = () => {
  const { t } = useTranslation()
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState({
    isSerialized: false,
    hasEnding: true,
  })
  const [loading, setLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [imageUrl, setImageUrl] = useState()
  const [selectCategories, setSelectCategories] = useState()

  const categoryDict = useFetch('/api/admin/v1/categories', [])

  const selectedCategoryList = (bookId) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/admin/v1/books/${bookId}/categories`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            resolve(res.data)
          }
        })
        .catch((err) => {
          message.error(
            `${t('message.error.failureReason')}${err.response?.data?.message}`,
          )
          reject(err)
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
      .get(`/api/admin/v1/books/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setImageUrl(resultData.coverImg)
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
    selectedCategoryList(queryId).then((selected) => {
      setSelectCategories(
        Array.from(new Set(selected.flatMap((mData) => mData.id))),
      )
    })
  }, [queryId])

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
            onClick={() => navigate(Routes.BOOK_LIST.path)}
          />
          {t('title.bookViewing')}
        </>
      }
    >
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            form={form}
            initialValues={{
              ...initFormData,
            }}
          >
            <Divider orientation="left">{t('title.basicInfo')}</Divider>
            <ViewItem
              label={t('title.bookName')}
              value={initFormData?.bookName}
            />
            <ViewItem label={t('title.author')} value={initFormData?.author} />
            <ViewItem
              label={t('title.classification')}
              value={categoryDict.fetchedData
                ?.filter((cate) => selectCategories?.includes(cate.id))
                .map((cate) => cate.categoryName)
                .join(', ')}
            />
            <ViewItem
              label={t('title.keyword')}
              value={initFormData?.keywords?.join(', ')}
            />
            <ViewItem
              label={t('title.bookIntroduction')}
              value={initFormData?.introduction}
            />
            <ViewItem
              label={t('title.cover')}
              value={
                <img src={imageUrl} alt="avatar" style={{ height: 200 }} />
              }
            />
            <Divider orientation="left">{t('title.bookProperties')}</Divider>
            <ViewItem
              label={t('title.publishInInstalments')}
              value={
                initFormData?.isSerialized
                  ? t('title.status.yes')
                  : t('title.status.no')
              }
            />
            <ViewItem
              label={t('title.end')}
              value={
                initFormData?.hasEnding
                  ? t('title.status.yes')
                  : t('title.status.no')
              }
            />
            <Divider orientation="left">{t('title.status.booking')}</Divider>
            <ViewItem
              label={t('title.status')}
              value={
                initFormData?.status === 'ONLINE'
                  ? t('title.listed')
                  : t('title.notListed')
              }
            />
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default BookView
