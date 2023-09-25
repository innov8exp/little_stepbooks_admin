import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, message, Modal, Table } from 'antd'
import useFetch from '@/hooks/useFetch'
import axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import ProductForm from './form'
import i18n from '@/locales/i18n'

const { confirm } = Modal

const ProductPage = () => {
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/products`, [
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
      title: '确定删除次记录?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        axios
          .delete(`/api/admin/v1/products/${id}`)
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
    <Card title="产品套餐管理">
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}
        >
          新建
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
            title: '产品编号',
            key: 'productNo',
            dataIndex: 'productNo',
          },
          {
            title: '书币',
            key: 'coinAmount',
            dataIndex: 'coinAmount',
          },
          {
            title: '价格',
            key: 'price',
            dataIndex: 'price',
            render: (text) => `$ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          },
          {
            title: '平台',
            key: 'platform',
            dataIndex: 'platform',
          },
          {
            title: '平台产品ID',
            key: 'storeProductId',
            dataIndex: 'storeProductId',
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record.id)}
                    type="link"
                  >
                    编辑
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    删除
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
      <ProductForm
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

export default ProductPage
