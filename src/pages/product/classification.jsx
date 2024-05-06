import { App, Button, Card, message, Table } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import EditForm from '@/components/edit-form'
import { useTranslation } from 'react-i18next'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const ClassificationListPage = () => {
  const apiPath = 'classifications'
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [listData, setListData] = useState([])
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(true)


  // 页面创建后加载一遍数据
  useEffect(() => {
    const searchURL = `/api/admin/v1/${apiPath}`
    axios.get(searchURL).then((res) => {
      if (res && res.status === HttpStatus.OK) {
        setListData(res.data)
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const loadListData = function () {
    setLoading(true)
    const searchURL = `/api/admin/v1/${apiPath}`
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          setListData(res.data)
        }
      })
      .catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddAction = () => {
    setEdiVisible(true)
    setEditData({})
  }

  const handleEditAction = (item) => {
    setEdiVisible(true)
    setEditData(item)
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios.delete(`/api/admin/v1/${apiPath}/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              loadListData()
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
      },
    })
  }

  return (
    <Card title={t('menu.classificationManagement')} extra={
      <Button type="primary" onClick={handleAddAction}>
        {t('button.create')}
      </Button>
    }>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('title.classificationName')}`,
            key: 'classificationName',
            dataIndex: 'classificationName',
          },
          {
            title: `${t('title.description')}`,
            key: 'description',
            dataIndex: 'description',
          },
          {
            title: `${t('title.minAge')}`,
            key: 'minAge',
            dataIndex: 'minAge',
          },
          {
            title: `${t('title.maxAge')}`,
            key: 'maxAge',
            dataIndex: 'maxAge',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 90,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record)}
                    type="link"
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    {t('button.delete')}
                  </Button>
                </div>
              )
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={listData}
        loading={loading}
        pagination={false}
      />
      <EditForm
        visible={ediVisible}
        apiPath={apiPath}
        title='title.classification'
        formData={editData}
        formKeys={[
          { type:'input', key: 'classificationName', label: 'name', placeholder: 'message.check.name'},
          { type:'textarea', key: 'description'},
          { type:'number', min: 0, max: 120, key: 'minAge', label: 'title.minAge'},
          { type:'number', min: 0, max: 120, key: 'maxAge', label: 'title.maxAge'},
        ]}
        onCancel={() => setEdiVisible(false)}
        onSave={() => {
          setEdiVisible(false)
          loadListData()
        }}
      />
    </Card>
  )
}

export default ClassificationListPage
