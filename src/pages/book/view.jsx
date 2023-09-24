import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Empty, Form, message, Skeleton } from 'antd'
import { Routes } from '@/libs/router'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import { useQuery } from '@/hooks/useQuery'
import ViewItem from '@/components/view-item'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BookView = () => {
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
          message.error(`操作失败，原因：${err.response?.data?.message}`)
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
        message.error(`操作失败，原因：${err.response?.data?.message}`)
        setIsDisplayForm(false)
      })
      .finally(() => setLoading(false))
    selectedCategoryList(queryId).then((selected) => {
      setSelectCategories(
        Array.from(new Set(selected.flatMap((mData) => mData.id)))
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
            type='link'
            size='large'
            icon={<LeftCircleOutlined />}
            onClick={() => navigate(Routes.BOOK_LIST.path)}
          />
          小说查看
        </>
      }>
      {isDisplayForm ? (
        <Skeleton loading={loading} active>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            form={form}
            initialValues={{
              ...initFormData,
            }}>
            <Divider orientation='left'>基本信息</Divider>
            <ViewItem label='书名' value={initFormData?.bookName} />
            <ViewItem label='作者' value={initFormData?.author} />
            <ViewItem
              label='分类'
              value={categoryDict.fetchedData
                ?.filter((cate) => selectCategories?.includes(cate.id))
                .map((cate) => cate.categoryName)
                .join(', ')}
            />
            <ViewItem
              label='关键词'
              value={initFormData?.keywords?.join(', ')}
            />
            <ViewItem label='书籍介绍' value={initFormData?.introduction} />
            <ViewItem
              label='封面'
              value={
                <img src={imageUrl} alt='avatar' style={{ height: 200 }} />
              }
            />
            <Divider orientation='left'>小说属性</Divider>
            <ViewItem
              label='连载'
              value={initFormData?.isSerialized ? '是' : '否'}
            />
            <ViewItem
              label='完结'
              value={initFormData?.hasEnding ? '是' : '否'}
            />
            <Divider orientation='left'>小说状态</Divider>
            <ViewItem
              label='状态'
              value={initFormData?.status === 'ONLINE' ? '已上架' : '未上架'}
            />
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>获取信息失败</span>} />
      )}
    </Card>
  )
}

export default BookView
