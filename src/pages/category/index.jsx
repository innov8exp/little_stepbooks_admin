import {
  DownCircleOutlined,
  ExclamationCircleOutlined,
  UpCircleOutlined,
} from '@ant-design/icons'
import { Button, Card, message, Modal, Table } from 'antd'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import CategoryForm from './form'
import i18n from '@/locales/i18n'

const { confirm } = Modal

const CategoryPage = () => {
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/categories`, [
    changeTime,
  ])
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()

  const handleEditAction = (id) => {
    setSelectedId(id)
    setFormVisible(true)
  }

  const handleDeleteAction = (id) => {
    confirm({
      title: `${i18n.t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        axios
          .delete(`/api/admin/v1/categories/${id}`)
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

  const handleSortAction = (id, direction) => {
    axios
      .put(`/api/admin/v1/categories/${id}/sort`, { direction })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success('change succeed!')
          setChangeTime(Date.now())
        }
      })
      .catch((err) => {
        console.error(err)
        message.error(err.message)
      })
  }

  return (
    <Card title={i18n.t('title.categoryManagement')}>
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
            title: '分类名称',
            key: 'categoryName',
            dataIndex: 'categoryName',
          },
          {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            render: (text, record, index) => {
              return (
                <div>
                  {index === 0 ? (
                    ''
                  ) : (
                    <Button
                      type="link"
                      onClick={() => handleSortAction(record.id, 'UP')}
                    >
                      <UpCircleOutlined />
                    </Button>
                  )}

                  {index === fetchedData.length - 1 ? (
                    ''
                  ) : (
                    <Button
                      type="link"
                      onClick={() => handleSortAction(record.id, 'DOWN')}
                    >
                      <DownCircleOutlined />
                    </Button>
                  )}

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
                    {i18n.t('button.delete')}
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
      <CategoryForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false)
          setChangeTime(Date.now())
        }}
        id={selectedId}
      />
    </Card>
  )
}

export default CategoryPage
