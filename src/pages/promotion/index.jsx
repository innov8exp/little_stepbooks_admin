import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, message, Modal, Table } from 'antd'
import useFetch from '@/hooks/useFetch'
import Axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import PromotionForm from './form'

const { confirm } = Modal

const PromotionPage = () => {
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/promotions`, [
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
        Axios.delete(`/api/admin/v1/promotions/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success('操作成功!')
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
    <Card title='促销管理'>
      <ButtonWrapper>
        <Button
          type='primary'
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}>
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
            title: '书籍',
            key: 'bookName',
            dataIndex: 'bookName',
          },
          {
            title: '章节原价（书币）',
            key: 'originalCoinAmount',
            dataIndex: 'originalCoinAmount',
          },
          {
            title: '章节现价（书币）',
            key: 'coinAmount',
            dataIndex: 'coinAmount',
          },
          {
            title: '促销类型',
            key: 'promotionType',
            dataIndex: 'promotionType',
            render: (text) => (text === 'LIMIT_FREE' ? '限时免费' : '限时促销'),
          },
          {
            title: '开始时间',
            key: 'limitFrom',
            dataIndex: 'limitFrom',
          },
          {
            title: '结束时间',
            key: 'limitTo',
            dataIndex: 'limitTo',
          },
          {
            title: '折扣%',
            key: 'discountPercent',
            dataIndex: 'discountPercent',
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
                    type='link'>
                    编辑
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type='link'>
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
      <PromotionForm
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

export default PromotionPage
