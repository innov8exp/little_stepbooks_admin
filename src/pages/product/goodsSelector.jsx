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
    onPhySelect = () => {

    },
    onVirSelect = () => {

    },
    onCancel = () => {

    }
}) => {
  const { t } = useTranslation()
  const [listData, setListData] = useState([])
  const [name, setName] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
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

  const loadListData = function (currentPage) {
    currentPage = currentPage || pageNumber
    setLoading(true)
    let searchURL = `/api/admin/v1/${isPhysical ? 'physical-goods' : 'virtual-category'}?currentPage=${pageNumber}&pageSize=${pageSize}`
    if(name){
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
      title: `${t('title.operate')}`,
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
      title={t('menu.physicalGoodsList')}
      onCancel={onCancel}
      footer={null}
    >
      <div style={{ marginBottom: 12 }}>
        <Input value={name} placeholder={t('message.placeholder.skuName')} style={{ width: 200 }} onChange={onNameChange} />
        <Button icon={<SearchOutlined />} type="primary" onClick={() => loadListData()} style={{ margin: '0 15px' }}>{t('button.search')} </Button>
        <Button icon={<UndoOutlined />} onClick={() => setName(null)}>{t('button.reset')} </Button>
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
    onVirSelect: PropTypes.func,
    onPhySelect: PropTypes.func,
    onCancel: PropTypes.func,
  }

export default GoodsSelector
