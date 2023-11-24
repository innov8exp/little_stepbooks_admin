import DebounceSelect from '@/components/debounce-select'
import ImageListUpload from '@/components/image-list-upload'
import useQuery from '@/hooks/useQuery'
import { Routes } from '@/libs/router'
import { LeftCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Skeleton,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useFetch from '@/hooks/useFetch'

const { TextArea } = Input
const { Option } = Select

const ProductForm = () => {
  const { t } = useTranslation()
  const query = useQuery()
  const queryId = query.get('id')
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(!queryId)
  const [initBookSetOptions, setInitBookSetOptions] = useState([])

  const classifications = useFetch('/api/admin/v1/classifications', [])

  const selectedClassifications = useCallback(
    (productId) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/admin/v1/products/${productId}/classifications`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              resolve(res.data)
            }
          })
          .catch((err) => {
            message.error(
              `${t('message.error.failureReason')}${
                err.response?.data?.message
              }`,
            )
            reject(err)
          })
      })
    },
    [t],
  )

  const initData = useCallback(() => {
    fetchBookSet().then((res) => setInitBookSetOptions(res))
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
          const coverImgArr = []
          if (resultData.coverImgId) {
            coverImgArr.push({
              id: resultData.coverImgId,
              name: resultData.coverImgUrl?.split('/')?.pop(),
              url: resultData.coverImgUrl,
              response: {
                id: resultData.coverImgId,
                objectUrl: resultData.coverImgUrl,
              },
            })
          }
          setInitFormData({
            ...resultData,
            media: resultData.medias?.map((item) => ({
              id: item.mediaId,
              name: item.mediaUrl?.split('/')?.pop(),
              url: item.mediaUrl,
              response: { id: item.mediaId, objectUrl: item.mediaUrl },
            })),
            coverImg: coverImgArr,
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
    selectedClassifications(queryId).then((selected) => {
      form.setFieldsValue({
        classificationIds: Array.from(
          new Set(selected.flatMap((mData) => mData.id)),
        ),
      })
    })
  }, [form, queryId, selectedClassifications, t])

  const createData = (createdData) => {
    setSaveLoading(true)
    axios
      .post('/api/admin/v1/products', {
        ...createdData,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.PRODUCT_LIST.path)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (updateData) => {
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/products/${queryId}`, {
        ...updateData,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success(`${t('message.successfullySaved')}`)
          navigate(Routes.PRODUCT_LIST.path)
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
        console.log('数字：', values)
        if (queryId) {
          updateData({
            ...values,
            coverImgId: values?.coverImg?.[0]?.response?.id,
            coverImgUrl: values?.coverImg?.[0]?.response?.objectUrl,
            medias: values?.media?.map((item) => ({
              mediaId: item?.response?.id,
              mediaUrl: item?.response?.objectUrl,
            })),
          })
        } else {
          createData({
            ...values,
            coverImgId: values?.coverImg?.[0]?.response?.id,
            coverImgUrl: values?.coverImg?.[0]?.response?.objectUrl,
            medias: values?.media?.map((item) => ({
              mediaId: item?.response?.id,
              mediaUrl: item?.response?.objectUrl,
            })),
          })
        }
      })
      .catch((e) => {
        console.error(e)
        message.error(`${t('message.error.validateFields')}`)
      })
  }

  const fetchBookSet = async (value) => {
    return new Promise((resolve, reject) => {
      let url = `/api/admin/v1/book-sets?name=${value}&currentPage=1&pageSize=10`
      if (!value) {
        url = `/api/admin/v1/book-sets?currentPage=1&pageSize=10`
      }
      axios
        .get(url)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data
            const bookSets = results.records
            const options = bookSets.map((item) => ({
              label: item.name,
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
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              form={form}
              initialValues={{
                ...initFormData,
              }}
            >
              {queryId && (
                <Form.Item name="skuCode" label={t('title.skuCode')}>
                  <Input readOnly />
                </Form.Item>
              )}

              <Form.Item
                name="skuName"
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
                name="productNature"
                label={t('title.productNature')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.productNature')}`,
                  },
                ]}
              >
                <Select>
                  <Option value="PHYSICAL">{t('PHYSICAL')}</Option>
                  <Option value="VIRTUAL">{t('VIRTUAL')}</Option>
                </Select>
              </Form.Item>
              <Form.Item name="bookSetId" label={t('title.bookSet')}>
                <DebounceSelect
                  showSearch
                  initOptions={initBookSetOptions}
                  fetchOptions={fetchBookSet}
                  placeholder={t('message.placeholder.enterBookSetSearch')}
                />
              </Form.Item>
              <Form.Item name="parsedMaterials" label={t('title.materials')}>
                <Checkbox.Group placeholder={t('message.check.materials')}>
                  <Checkbox value="AUDIO" key="AUDIO">
                    {t('AUDIO')}
                  </Checkbox>
                  <Checkbox value="COURSE" key="COURSE">
                    {t('COURSE')}
                  </Checkbox>
                  <Checkbox value="EXERCISE" key="EXERCISE">
                    {t('EXERCISE')}
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="classificationIds"
                label={t('title.classification')}
              >
                <Checkbox.Group
                  placeholder={t('message.check.selectClassification')}
                >
                  {classifications.fetchedData?.map((cate) => {
                    return (
                      <Checkbox value={cate.id} key={cate.id}>
                        {cate.classificationName}
                      </Checkbox>
                    )
                  })}
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="parsedSalesPlatforms"
                label={t('title.salesPlatforms')}
              >
                <Checkbox.Group placeholder={t('message.check.salesPlatforms')}>
                  <Checkbox value="MINI_PROGRAM" key="MINI_PROGRAM">
                    {t('MINI_PROGRAM')}
                  </Checkbox>
                  <Checkbox value="APP" key="APP">
                    {t('APP')}
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="price"
                label={t('title.price')}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.price')}`,
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder={t('message.check.price')}
                  prefix="￥"
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  precision={2}
                />
              </Form.Item>
              <Form.Item
                name="coverImg"
                label={t('title.cover')}
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e
                  }
                  return e?.fileList
                }}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.uploadCoverImage')}`,
                  },
                ]}
              >
                <ImageListUpload
                  domain={'PRODUCT'}
                  maxCount={1}
                  buttonName={t('title.coverUpload')}
                />
              </Form.Item>
              <Form.Item
                name="media"
                label={t('title.media')}
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e
                  }
                  return e?.fileList
                }}
                rules={[
                  {
                    required: true,
                    message: `${t('message.check.media')}`,
                  },
                ]}
              >
                <ImageListUpload domain="PRODUCT" />
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
    </>
  )
}

export default ProductForm
