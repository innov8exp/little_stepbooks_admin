import { Button, message, Table, Modal, Input, Image } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons'

const GoodsSelector = ({
    visible = false,
    isPhysical = true,
    isPoint = false,
    onPhySelect = () => { },
    onVirSelect = () => { },
    onCancel = () => { }
}) => {
  const { t } = useTranslation()
  const [listData, setListData] = useState([])
  const [name, setName] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  // const [storeType, setStoreType] = useState('REGULAR')
  const pageSize = 10;
  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      loadListData(current)
    }
  }

  // 页面创建后加载一遍数据
  useEffect(() => {
    if(visible){
        loadListData()
    }else{
        setPageNumber(1)
        setListData([])
        setName(null)
        setTotal(0)
    }
  }, [visible])

  const onNameChange = e => {
    setName(e.target.value)
  }

  const loadListData = function (currentPage, ignoreName) {
    currentPage = currentPage || pageNumber
    setLoading(true)
    const path = isPhysical ? `physical-goods?storeType=${isPoint ? 'POINTS' : 'REGULAR'}` : 'virtual-category?includeChildren=true'
    let searchURL = `/api/admin/v1/${path}&currentPage=${pageNumber}&pageSize=${pageSize}`
    if(!ignoreName && name){
      searchURL += `&name=${encodeURIComponent(name)}`
    }
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setPageNumber(currentPage)
          setListData(responseObject.records)
          setTotal(responseObject.total)
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

  const onReset = function () {
    setName(null)
    loadListData(null, true)
  }

  const physicalTableCol = [
    {
      title: '#',
      key: 'number',
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t('title.name')}`,
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: `${t('title.description')}`,
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: `${t('title.cover')}`,
      key: 'coverUrl',
      dataIndex: 'coverUrl',
      render: (text) => <Image height={50} src={text} />,
    },
    {
      title: `${t('storeType')}`,
      key: 'storeType',
      dataIndex: 'storeType',
      render: (text) => t(text === 'POINTS' ? 'pointGoods' : 'normalGoods'),
    },
    {
      title: `${t('title.operate')}`,
      align: 'center',
      key: 'action',
      width: 140,
      render: (text, record) => {
        return (
          <div>
            <Button
              onClick={() => onPhySelect(record)}
              type="link"
            >
              {t('select')}
            </Button>
          </div>
        )
      },
    },
  ]

  const virtualTableCol = [
    {
      title: '#',
      key: 'number',
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t('title.name')}`,
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => record.parent ? `${record.parent.name} - ${text}` : text,
    },
    {
      title: `${t('title.description')}`,
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: `${t('redeemAfterPay')}`,
      key: 'redeemAfterPay',
      align: 'center',
      width: 140,
      render: (text, record) => {
        return (
          <div>
            <Button
              onClick={() => onVirSelect({
                categoryId: record.id,
                redeemCondition: 'PAYMENT_SUCCESS'
              })}
              type="link"
            >
              {t('select')}
            </Button>
          </div>
        )
      },
    },
    {
      title: `${t('redeemAfterSign')}`,
      key: 'redeemAfterSign',
      align: 'center',
      width: 140,
      render: (text, record) => {
        return (
          <div>
            <Button
              onClick={() => onVirSelect({
                categoryId: record.id,
                redeemCondition: 'SIGN_SUCCESS'
              })}
              type="link"
            >
              {t('select')}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <Modal
      open={visible}
      width={900}
      title={t(isPhysical ? 'menu.physicalGoodsList' : 'menu.virtualGoodsList')}
      onCancel={onCancel}
      footer={null}
    >
      <div style={{ marginBottom: 12 }}>
        <Input value={name} placeholder={t('message.placeholder.name')} style={{ width: 200 }} onChange={onNameChange} />
        <Button icon={<SearchOutlined />} type="primary" onClick={() => loadListData()} style={{ margin: '0 15px' }}>{t('button.search')} </Button>
        <Button icon={<UndoOutlined />} onClick={onReset}>{t('button.reset')} </Button>
      </div>
      <Table
        columns={isPhysical ? physicalTableCol : virtualTableCol}
        rowKey={(record) => record.id}
        dataSource={listData}
        loading={loading}
        pagination={paginationProps}
      />
    </Modal>
  )
}

GoodsSelector.propTypes = {
    visible: PropTypes.bool,
    isPhysical: PropTypes.bool,
    isPoint: PropTypes.bool,
    onVirSelect: PropTypes.func,
    onPhySelect: PropTypes.func,
    onCancel: PropTypes.func,
  }

export default GoodsSelector
