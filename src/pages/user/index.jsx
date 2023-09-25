import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, message, Modal, Table } from 'antd'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import UserForm from './form'
import i18n from '@/locales/i18n'

const { confirm } = Modal

const UserPage = () => {
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
      title: '确定删除次记录?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        axios
          .delete(`/api/admin/v1/users/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(i18n.t('message.successInfo'))
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
    <Card title={i18n.t('title.userManagement')}>
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}
        >
          {i18n.t('button.create')}
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
            title: 'Username',
            key: 'username',
            dataIndex: 'username',
          },
          {
            title: '昵称',
            key: 'nickname',
            dataIndex: 'nickname',
          },
          {
            title: '邮箱',
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
            title: '手机',
            key: 'phone',
            dataIndex: 'phone',
          },
          {
            title: '设备编号',
            key: 'deviceId',
            dataIndex: 'deviceId',
          },
          {
            title: '性别',
            key: 'gender',
            dataIndex: 'gender',
          },
          {
            title: '创建时间',
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: '状态',
            key: 'active',
            dataIndex: 'active',
            render: (text) => (text ? '激活' : '禁用'),
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record.id)}
                    type="link"
                  >
                    {i18n.t('button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    {i18n.t('button.disable')}
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
