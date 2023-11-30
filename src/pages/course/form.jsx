import FileListUpload from '@/components/file-list-upload'
import ImageListUpload from '@/components/image-list-upload'
import { LeftCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  TimePicker,
  Radio,
  Row,
  Skeleton,
  message,
} from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

const { TextArea } = Input

const CourseForm = () => {
  const { t } = useTranslation()
  const params = useParams()
  const bookId = params?.bookId
  const id = params?.id
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [initFormData, setInitFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isDisplayForm, setIsDisplayForm] = useState(true)

  const initData = useCallback(() => {
    if (!id) {
      return
    }
    setLoading(true)
    setIsDisplayForm(true)

    axios
      .get(`/api/admin/v1/courses/${id}`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          const resultData = res.data
          const videoArr = []
          if (resultData.videoId) {
            videoArr.push({
              id: resultData.videoId,
              name: resultData.videoUrl?.split('/')?.pop()?.split('?')?.shift(),
              url: resultData.videoUrl,
              response: {
                id: resultData.videoId,
                objectUrl: resultData.videoUrl,
                objectKey: resultData.videoKey,
              },
            })
          }
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
          console.log(dayjs(resultData.duration, 'mm:ss'))
          setInitFormData({
            ...resultData,
            video: videoArr,
            coverImg: coverImgArr,
            duration: resultData.duration
              ? dayjs(resultData.duration, 'mm:ss')
              : dayjs('00:00', 'mm:ss'),
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
  }, [id, t])

  const createData = (data) => {
    setSaveLoading(true)
    axios
      .post(`/api/admin/v1/books/${bookId}/courses`, {
        ...data,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(-1)
        }
      })
      .catch((err) => {
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => setSaveLoading(false))
  }

  const updateData = (data) => {
    console.log(data)
    setSaveLoading(true)
    axios
      .put(`/api/admin/v1/courses/${id}`, {
        ...data,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('保存成功!')
          navigate(-1)
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
        console.log(values)
        if (id) {
          updateData({
            ...values,
            coverImgId: values.coverImg?.[0]?.response?.id,
            coverImgUrl: values.coverImg?.[0]?.response?.objectUrl,
            videoId: values.video?.[0]?.response?.id,
            videoUrl: values.video?.[0]?.response?.objectKey,
            duration: values.duration.format('mm:ss'),
          })
        } else {
          createData({
            ...values,
            coverImgId: values.coverImg?.[0]?.response?.id,
            coverImgUrl: values.coverImg?.[0]?.response?.objectUrl,
            videoId: values.video?.[0]?.response?.id,
            videoUrl: values.video?.[0]?.response?.objectKey,
            duration: values.duration.format('mm:ss'),
          })
        }
      })
      .catch()
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
            onClick={() => navigate(`/books/${bookId}/courses`)}
          />
          {t('button.courseEditing')}
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
              label={t('title.courseName')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.courseName')}`,
                },
              ]}
            >
              <Input
                placeholder={t('message.check.courseName')}
                maxLength={30}
              />
            </Form.Item>
            <Form.Item name="description" label={t('title.courseIntroduction')}>
              <TextArea
                rows={2}
                style={{ resize: 'none' }}
                placeholder={t('message.check.courseIntroduction')}
              />
            </Form.Item>
            <Form.Item
              name="author"
              label={t('title.lecturer')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.lecturer')}`,
                },
              ]}
            >
              <Input placeholder={t('message.check.lecturer')} maxLength={20} />
            </Form.Item>
            <Form.Item
              name="authorIntroduction"
              label={t('title.authorIntroduction')}
            >
              <TextArea
                rows={2}
                style={{ resize: 'none' }}
                placeholder={t('message.check.authorIntroduction')}
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label={t('title.duration')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.duration')}`,
                },
              ]}
            >
              <TimePicker
                format={'mm:ss'}
                placeholder={'mm:ss'}
                showNow={false}
                allowClear={false}
                defaultValue={dayjs('00:00', 'mm:ss')}
              />
            </Form.Item>
            <Form.Item
              name="courseNature"
              label={t('title.courseNature')}
              rules={[
                {
                  required: true,
                  message: `${t('message.check.courseNature')}`,
                },
              ]}
            >
              <Radio.Group>
                <Radio value={'NEED_TO_PAY'}>{t('title.NEED_TO_PAY')}</Radio>
                <Radio value={'TRIAL'}>{t('title.TRIAL')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="coverImg"
              label={t('title.image')}
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
                  message: `${t('message.check.uploadImage')}`,
                },
              ]}
            >
              <ImageListUpload
                domain={'COURSE'}
                maxCount={1}
                buttonName={t('title.coverUpload')}
              />
            </Form.Item>
            <Form.Item
              name="video"
              label={t('title.video')}
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
                  message: `${t('message.check.video')}`,
                },
              ]}
            >
              <FileListUpload
                domain={'COURSE'}
                permission="PRIVATE"
                maxCount={1}
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

export default CourseForm
