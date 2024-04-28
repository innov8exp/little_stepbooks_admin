import { App, Button, Card, message, Table } from 'antd'
import { querySkuPhysicalGoods, querySkuVirtualGoods } from '@/api'
import { ButtonWrapper } from '@/components/styled'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const SkuGoodsPage = () => {
  const params = useParams()
  const skuId = params?.skuId;
  const spuId = params?.spuId;
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [phyGoodsArr, setPhyGoodsArr] = useState([])
  const [virGoodsArr, setVirGoodsArr] = useState([])
  const [allGoodsArr, setAllGoodsArr] = useState([])
  const [editVisible, setEditVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  // 页面创建后加载一遍数据
  useEffect(() => {
    loadPhyData()
    loadVirData()
  }, [spuId, skuId])

  // 页面创建后加载一遍数据
  useEffect(() => {
    setAllGoodsArr([
      ...phyGoodsArr,
      ...virGoodsArr
    ])
    // loadAllGoods()
  }, [phyGoodsArr, virGoodsArr])

  // 拉取全部的物理产品和虚拟产品的列表

  const loadPhyData = () => {
    setLoading(true)
    querySkuPhysicalGoods(spuId, skuId).then(data => {
      setPhyGoodsArr(data.records)
      setLoading(false)
    })
  }

  const loadVirData = () => {
    setLoading(true)
    querySkuVirtualGoods(spuId, skuId).then(data => {
      setVirGoodsArr(data.records)
      setLoading(false)
    })
  }

  const handleAddAction = () => {
    setEditVisible(true)
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        
      },
    })
  }

  return (
    <Card title={t('skuRelationWidthGoods')}>
      <ButtonWrapper>
          <Button type="primary" onClick={handleAddAction}>
              {t('bindPhysicalGoods')}
          </Button>
          <Button style={{ marginLeft: '20px' }} type="primary" onClick={handleAddAction}>
              {t('bindVirtualGoods')}
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
            title: `${t('name')}`,
            key: 'name',
            dataIndex: 'name',
          },
          {
            title: `${t('description')}`,
            key: 'description',
            dataIndex: 'description',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 80,
            render: (text, record) => {
              return (
                <div>
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
        dataSource={allGoodsArr}
        loading={loading}
      />
    </Card>
  )
}

export default SkuGoodsPage