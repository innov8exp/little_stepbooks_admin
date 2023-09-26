import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, message, Modal, Table } from 'antd'
import useFetch from '@/hooks/useFetch'
import Axios from 'axios'
import { ButtonWrapper } from '@/components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import PromotionForm from './form'
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

const PromotionPage = () => {
  const { t } = useTranslation()
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
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        Axios.delete(`/api/admin/v1/promotions/${id}`)
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
    <Card title={t('title.label.promotion')}>
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
            title: `${t('title.name')}`,
            key: 'bookName',
            dataIndex: 'bookName',
          },
          {
            title: `${t('title.label.chapterOriginalPrice')}`,
            key: 'originalCoinAmount',
            dataIndex: 'originalCoinAmount',
          },
          {
            title: `${t('title.currentPrice')}`,
            key: 'coinAmount',
            dataIndex: 'coinAmount',
          },
          {
            title: `${t('title.label.promotionType')}`,
            key: 'promotionType',
            dataIndex: 'promotionType',
            render: (text) =>
              text === 'LIMIT_FREE'
                ? `${t('title.label.limitedTimeFree')}`
                : `${t('title.LimitedPromotion')}`,
          },
          {
            title: `${t('title.startTime')}`,
            key: 'limitFrom',
            dataIndex: 'limitFrom',
          },
          {
            title: `${t('title.endtTime')}`,
            key: 'limitTo',
            dataIndex: 'limitTo',
          },
          {
            title: `${t('title.label.discount')}`,
            key: 'discountPercent',
            dataIndex: 'discountPercent',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 300,
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
                    {t('button.delete')}
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
