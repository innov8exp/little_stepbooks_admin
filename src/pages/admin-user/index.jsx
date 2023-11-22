import { ButtonWrapper } from '@/components/styled'
import useFetch from '@/hooks/useFetch'
import { Button, Card, Table, Image } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminUserForm from './form'
import useUserInfoStore from '@/stores/useUserInfoStore'

const AdminUserPage = () => {
  const { t } = useTranslation()
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/admin-users`, [
    changeTime,
  ])
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const { userInfo } = useUserInfoStore()

  const handleEditAction = (id) => {
    setSelectedId(id)
    setFormVisible(true)
  }

  // const handleDeleteAction = (id) => {
  //   confirm({
  //     title: `${t('message.tips.delete')}`,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: `${t('button.determine')}`,
  //     okType: 'primary',
  //     cancelText: `${t('button.cancel')}`,
  //     onOk() {
  //       axios
  //         .delete(`/api/admin/v1/admin-users/${id}`)
  //         .then((res) => {
  //           if (res.status === HttpStatus.OK) {
  //             message.success(t('message.successInfo'))
  //             setChangeTime(Date.now())
  //           }
  //         })
  //         .catch((err) => {
  //           console.error(err)
  //           message.error(err.message)
  //         })
  //     },
  //   })
  // }

  return (
    <>
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
              title: `${t('title.avatarImage')}`,
              key: 'avatarImgUrl',
              dataIndex: 'avatarImgUrl',
              render: (text) => <Image height={50} src={text} />,
            },
            {
              title: `${t('title.label.username')}`,
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
              title: `${t('title.phone')}`,
              key: 'phone',
              dataIndex: 'phone',
            },
            {
              title: `${t('title.creationTime')}`,
              key: 'createdAt',
              dataIndex: 'createdAt',
            },
            {
              title: `${t('title.operate')}`,
              key: 'action',
              width: 200,
              render: (text, record) => {
                return (
                  <div>
                    {record.username === userInfo.username ? (
                      <Button
                        onClick={() => handleEditAction(record.id)}
                        type="link"
                      >
                        {t('button.edit')}
                      </Button>
                    ) : null}

                    {/* <Button
                    onClick={() => handleDeleteAction(record.id)}
                    danger
                    type="link"
                  >
                    {t('button.disable')}
                  </Button> */}
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
      </Card>
      <AdminUserForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false)
          setChangeTime(Date.now())
        }}
        id={selectedId}
      />
    </>
  )
}

export default AdminUserPage
