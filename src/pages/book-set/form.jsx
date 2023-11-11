import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Skeleton,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import _ from 'lodash'
import DebounceSelect from '@/components/debounce-select'

const { TextArea } = Input

const BookSetForm = () => {
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
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [initBookOptions, setInitBookOptions] = useState([])
  const [bookIds, setBookIds] = useState([])

  const initData = useCallback(() => {
    if (!queryId) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    fetchBook().then((res) => setInitBookOptions(res))

    axios
      .get(`/api/admin/v1/book-sets/${queryId}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          setBookIds(resultData.bookIds)
          console.log(bookIds)
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
  }, [bookIds, queryId, t])

  const createData = (book) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/book-sets', {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.BOOK_SET_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (book) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/book-sets/${queryId}`, {
        ...book,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.BOOK_SET_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const handleSaveAction = () => {
    form
      .validateFields()
      .then((values) => {
        const bookIds = []
        _.forEach(values.bookNames, (item) => {
          bookIds.push(item.value)
        })
        values = { ...values, bookIds }
        console.log('数字：', values)
        if (queryId) {
          updateData({
            ...values,
            classifications: Array.from(new Set(values.classifications)),
          })
        } else {
          createData({
            ...values,
            classifications: Array.from(new Set(values.classifications)),
          })
        }
      })
      .catch()
  }

  const fetchBook = async (value) => {
    return new Promise((resolve, reject) => {
      let url = `/api/admin/v1/books?bookName=${value}&currentPage=1&pageSize=10`
      if (!value) {
        url = `/api/admin/v1/books?currentPage=1&pageSize=10`
      }
      axios
        .get(url)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const books = results.records
            const options = books.map((item) => ({
              label: item.bookName,
              value: item.id,
            }))
            resolve(options)
          }
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

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
            onClick={() => navigate(Routes.BOOK_SET_LIST.path)}
          />
          {t('button.bookSetEditing')}
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
            <Form.Item
              name="name"
              label={t('title.name')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.name')}`,
                },
              ]}
            >
              <Input placeholder={t('message.check.name')} maxLength={20} />
            </Form.Item>
            <Form.Item name="description" label={t('title.describe')}>
              <TextArea
                rows={3}
                style={{ resize: 'none' }}
                placeholder={t('message.placeholder.describe')}
              />
            </Form.Item>
            <Form.Item
              name="bookNames"
              label={t('title.book')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.book')}`,
                },
              ]}
            >
              <DebounceSelect
                showSearch
                mode="multiple"
                initOptions={initBookOptions}
                fetchOptions={fetchBook}
                value={bookIds}
                placeholder={t('message.placeholder.enterBookSearch')}
              />
            </Form.Item>
            <div style={{ marginTop: 10 }} />
            <Row justify="end">
              <Col>
                <Button type="default" onClick={() => form.resetFields()}>
                  {t('button.reset')}
                </Button>
                <span style={{ marginRight: 20 }} />
                <Button
                  loading={saveLoading}
                  type="primary"
                  onClick={() => handleSaveAction()}
                >
                  {t('button.saveData')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      ) : (
        <Empty description={<span>{t('message.error.failure')}</span>} />
      )}
    </Card>
  )
}

export default BookSetForm
