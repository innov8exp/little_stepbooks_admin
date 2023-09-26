/* eslint-disable no-restricted-globals */
import { InboxOutlined } from '@ant-design/icons'
import { Alert, message, Modal, Progress, Space, Switch, Upload } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const { Dragger } = Upload

const CenterWrapper = styled.div`
  text-align: center;
  padding-bottom: 24px;
`

const UploadForm = (bookId, visible, onCancel) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [uploadingPercent, setUploadingPercent] = useState(0)
  const [uploadStatus, setUploadStatus] =
    (useState < 'active') | 'exception' | 'normal' | ('success' > 'normal')
  const [tipText, setTipText] = useState('')
  //   const [saveLoading, setSaveLoading] = useState(false);
  const [uploadType, setUploadType] = (useState < 'NEW') | ('CONTINUE' > 'NEW')

  const handleUpload = (options) => {
    // setUploading(true);
    const { onSuccess, onError, file, onProgress } = options
    const fmData = new FormData()
    fmData.append('file', file)
    axios
      .post(
        `/api/admin/v1/chapters/upload?bookId=${bookId}&uploadType=${uploadType}`,
        fmData,
        {
          onUploadProgress: (e) => {
            onProgress({ percent: (e.loaded / e.total) * 100 })
            setUploadingPercent(Math.floor((e.loaded / e.total) * 100))
            setUploadStatus('active')
          },
          headers: { 'content-type': 'multipart/form-data' },
        },
      )
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          onSuccess()
          setUploadStatus('success')
          message.success(`${t('message.successInfo.parsedSuccessfully')}`)
        }
      })
      .catch((err) => {
        onError(err)
        setUploadStatus('exception')
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const beforeUpload = (file) => {
    setLoading(true)
    const isJpgOrPng = file.type === 'text/plain'
    if (!isJpgOrPng) {
      message.error(`${t('message.error.uploadType')}`)
    }
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error(`${t('message.error.fileSize')}`)
    }
    setLoading(isJpgOrPng && isLt50M)
    return isJpgOrPng && isLt50M
  }

  const clear = () => {
    setUploadType('CONTINUE')
    setLoading(false)
    setUploadingPercent(0)
  }

  useEffect(() => {
    if (uploadingPercent === 100) {
      setTipText(`${t('message.tips.uploadParsing')}`)
    } else {
      setTipText(`${t('message.tips.uploading')}`)
    }
  }, [uploadingPercent])

  return (
    <Modal
      open={visible}
      title={t('title.uploadFiles')}
      onCancel={() => {
        clear()
        onCancel()
      }}
      footer={false}
      width={640}
      style={{ position: 'relative' }}
    >
      {loading ? (
        <CenterWrapper>
          <Progress
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={uploadingPercent}
            status={uploadStatus}
          />
          <div>{tipText}</div>
        </CenterWrapper>
      ) : (
        ''
      )}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert message={t('message.tips.newUpload')} type="info" />
        <Switch
          checkedChildren={t('title.alreadyExists')}
          unCheckedChildren={t('title.newUpload')}
          defaultChecked
          onChange={(value) =>
            value ? setUploadType('CONTINUE') : setUploadType('NEW')
          }
        />
        <Dragger
          customRequest={handleUpload}
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('title.clickOrDrag')}</p>
        </Dragger>
      </Space>
    </Modal>
  )
}

export default UploadForm
