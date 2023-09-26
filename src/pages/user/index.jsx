import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, message, Modal, Table } from 'antd'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import UserForm from './form'
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

const UserPage = () => {
  const { t } = useTranslation()
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/users`, [changeTime])
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()

  const handleEditAction = (id) => {
    setSelectedId(id)
    setFormVisible(true)
  }

  const handleDeleteAction = (id) => {
    confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/users/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              setChangeTime(Date.now())
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
    <Card title={t('title.userManagement')}>
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}
        >
          {t('button.create')}
        </Button>
      </ButtonWrapper>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('title.label.userNickName')}`,
            key: 'username',
            dataIndex: 'username',
          },
          {
            title: `${t('title.userNickname')}`,
            key: 'nickname',
            dataIndex: 'nickname',
          },
          {
            title: `${t('title.email')}`,
            key: 'email',
            dataIndex: 'email',
          },
          {
            title: 'GoogleID',
            key: 'googleId',
            dataIndex: 'googleId',
          },
          {
            title: 'FacebookID',
            key: 'facebookId',
            dataIndex: 'facebookId',
          },
          {
            title: `${t('title.phone')}`,
            key: 'phone',
            dataIndex: 'phone',
          },
          {
            title: `${t('title.deviceId')}`,
            key: 'deviceId',
            dataIndex: 'deviceId',
          },
          {
            title: `${t('title.gender')}`,
            key: 'gender',
            dataIndex: 'gender',
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('title.status')}`,
            key: 'active',
            dataIndex: 'active',
            render: (text) =>
              text
                ? `${t('title.status.activation')}`
                : `${t('title.status.disable')}`,
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 150,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record.id)}
                    type="link"
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    {t('button.disable')}
                  </Button>
                </div>
              )
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={fetchedData}
        pagination={false}
        loading={loading}
      />
      <UserForm
        visible={formVisible}
        onCancel={() => {
          setFormVisible(false)
        }}
        onSave={() => {
          setFormVisible(false)
          setChangeTime(Date.now())
        }}
        id={selectedId}
      />
    </Card>
  )
}

export default UserPage
