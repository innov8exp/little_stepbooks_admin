import { App, Button, Card, Table } from 'antd'
import {
  querySkuPhysicalGoods,
  querySkuVirtualGoods,
  addSkuPhysicalGoods,
  addSkuVirtualGoods,
  deleteSkuPhysicalGoods,
  deleteSkuVirtualGoods
} from '@/api'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation } from 'react-router-dom'
import GoodsSelector from './goodsSelector'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const SkuGoodsPage = () => {
  const params = useParams()
  const location = useLocation()
  const isPoint = location.pathname.includes('point');
  const skuId = params?.skuId;
  const spuId = params?.spuId;
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [phyGoodsArr, setPhyGoodsArr] = useState([])
  const [virGoodsArr, setVirGoodsArr] = useState([])
  const [allGoodsArr, setAllGoodsArr] = useState([])
  const [addVisible, setAddVisible] = useState(false)
  const [isPhysical, setIsPhysical] = useState(false)
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
    if(isPoint){
      setVirGoodsArr([])
      return
    }
    setLoading(true)
    querySkuVirtualGoods(spuId, skuId).then(data => {
      setVirGoodsArr(data.records)
      setLoading(false)
    })
  }

  const handleAddAction = (isPhy) => {
    setIsPhysical(isPhy)
    setAddVisible(true)
  }

  const handleDeleteAction = (record) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        const task = record.categoryId ? deleteSkuVirtualGoods(record.id) : deleteSkuPhysicalGoods(record.id)
        task.then(() => {
          record.categoryId ? loadVirData() : loadPhyData()
        })
      },
    })
  }

  const onPhySelect = (item) => {
    addSkuPhysicalGoods({
      spuId,
      skuId,
      goodsId: item.id
    }).then(() => {
      setAddVisible(false)
      loadPhyData()
    })
  }

  const onVirSelect = ({ categoryId, redeemCondition }) => {
    addSkuVirtualGoods({
      spuId,
      skuId,
      categoryId,
      redeemCondition
    }).then(() => {
      setAddVisible(false)
      loadVirData()
    })
  }

  const onGoodsSelectCancel = () => {
    setAddVisible(false)
  }

  return (
    <Card title={t('skuRelationWidthGoods')} extra={
      isPoint ? 
      <Button type="primary" onClick={() => handleAddAction(true)}>
          {t('bindPhysicalGoods')}
      </Button>
      :
      <div>
          <Button type="primary" onClick={() => handleAddAction(true)}>
              {t('bindPhysicalGoods')}
          </Button>
          <Button style={{ marginLeft: '20px' }} type="primary" onClick={() => handleAddAction(false)}>
              {t('bindVirtualGoods')}
          </Button>
      </div>
    }>
      <Table
        columns={[
          {
            title: '#',
            key: 'number',
            render: (text, record, index) => index + 1,
          },
          {
            title: `${t('name')}`,
            key: 'goodsName',
            dataIndex: 'goodsName',
            render: (text, record) => record.goodsName || record.categoryName
          },
          {
            title: `${t('goodsType')}`,
            key: 'type',
            dataIndex: 'type',
            render: (text, record) => t(record.categoryId ? 'virtualGoods' : 'physicalGoods')
          },
          {
            title: `${t('redeemAt')}`,
            key: 'redeemCondition',
            dataIndex: 'redeemCondition',
            render: (text) => {
              if(text){
                return text === 'PAYMENT_SUCCESS' ? t('redeemAfterPay') : t('redeemAfterSign')
              }else{
                return '--'
              }
            }
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 80,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleDeleteAction(record)}
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
      <GoodsSelector
        visible={addVisible}
        isPhysical={isPhysical}
        onPhySelect={onPhySelect}
        onVirSelect={onVirSelect}
        onCancel={onGoodsSelectCancel}
      />
    </Card>
  )
}

export default SkuGoodsPage