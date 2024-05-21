import { App, Button, Card, message, Table, Row, Col, Form, Input, Select } from 'antd'
import { OrderedListOutlined } from '@ant-design/icons'
import axios from 'axios'
import http from '@/libs/http'
import HttpStatus from 'http-status-codes'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import VirtualForm from './virtual-form'
import { useTranslation } from 'react-i18next'
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const VirtualGoodsListPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const [changeTime, setChangeTime] = useState(Date.now())
  const [queryForm] = Form.useForm()
  const [searchCatArr, setSearchCatArr] = useState([])
  const [categoryArr, setCategoryArr] = useState([])
  const [goodsData, setGoodsData] = useState()
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current)
    }
  }

  const fetchAllCats = function (){
    const url = `virtual-category/all-endpoints`
    http.get(url).then(data => {
        setCategoryArr(data.map(item => ({ 
          value: item.id,
          label: item.parent ? `${item.parent.name} - ${item.name}` : item.name
        })))
    })
    http.get(`virtual-category?currentPage=1&pageSize=1000&includeChild=false`).then(res => {
      setSearchCatArr(res.records.map(item => ({ 
        value: item.id,
        label: item.parent ? `${item.parent.name} - ${item.name}` : item.name
      })))
    })
  }

  const handleSearch = () => {
    setChangeTime(Date.now())
  }

  const handleReset = () => {
    queryForm.resetFields()
    setChangeTime(Date.now())
  }

  const fetchGoods = useCallback(async () => {
    setLoading(true)
    let searchURL = `virtual-goods?currentPage=${pageNumber}&pageSize=${pageSize}`
    const queryValue = queryForm.getFieldsValue()
    if(queryValue.categoryId){
      searchURL += `&categoryId=${queryValue.categoryId}`
    }
    if(queryValue.name){
      searchURL += `&name=${queryValue.name}`
    }
    if(categoryArr.length === 0){
      fetchAllCats()
    }
    http.get(searchURL).then((data) => {
        setGoodsData(data.records)
        setTotal(data.total)
      }).catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => setLoading(false))
  }, [pageNumber, pageSize, queryForm, t])

  const handleEditAction = (id) => {
    setSelectedId(id)
    setFormVisible(true)
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios.delete(`/api/admin/v1/virtual-goods/${id}`).then((res) => {
          if (res.status === HttpStatus.OK) {
            setChangeTime(Date.now())
            message.success(`${t('message.archiveSuccessful')}`)
          }
        }).catch((err) => {
          message.error(
            `${t('message.error.failureReason')}${
              err.response?.data?.message
            }`,
          )
        })
      }
    })
  }

  const openCatListPage = () => {
    navigate(`/goods/category-list`)
  }

  const openAudioListPage = (id) => {
    navigate(`/goods/${id}/audio-list`)
  }

  const openVideoListPage = (id) => {
    navigate(`/goods/${id}/video-list`)
  }

  useEffect(() => {
    fetchGoods()
  }, [fetchGoods, pageNumber, changeTime])

  return (
    <Card title={t('menu.virtualGoodsList')} extra={
      <div>
        <Button
          type="default"
          icon={<OrderedListOutlined />}
          onClick={openCatListPage}
        >
          {t('menu.productCategoryManagement')}
        </Button>
        <Button
          style={{ marginLeft: '20px' }}
          type="primary"
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}
        >
          {t('button.create')}
        </Button>
      </div>
    }>
      <Form
        wrapperCol={{ span: 18 }}
        form={queryForm}
        initialValues={{ categoryId: null, name: '' }}
      >
      <Row>
        <Col span={8}>
          <Form.Item label={t('title.productCategory')} name="categoryId">
            <Select placeholder={t('pleaseSelect')} options={ searchCatArr }></Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('title.name')} name="name">
            <Input placeholder={t('message.placeholder.name')} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={handleSearch}>
            {t('button.search')}
          </Button>
          <Button type="default" onClick={handleReset} style={{ marginLeft: 20 }}>
            {t('button.reset')}
          </Button>
        </Col>
      </Row>
      </Form>
      <Table
        columns={[
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
            title: `${t('title.productCategory')}`,
            key: 'categoryId',
            dataIndex: 'categoryId',
            render: (text, record) => {
              if(record.category){
                if(record.category.parent){
                  return `${record.category.parent.name} - ${record.category.name}`
                }else{
                  return record.category.name
                }
              }else{
                return null
              }
            }
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 140,
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
                  <Button
                    onClick={() => openAudioListPage(record.id)}
                    type="link"
                  >
                    {t('button.audioManage')}
                  </Button>
                  <Button
                    onClick={() => openVideoListPage(record.id)}
                    type="link"
                  >
                    {t('button.videoManage')}
                  </Button>
                </div>
              )
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={goodsData}
        loading={loading}
        pagination={paginationProps}
      />
      <VirtualForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false)
          setChangeTime(Date.now())
        }}
        id={selectedId}
        categoryArr={categoryArr}
      />
    </Card>
  )
}

export default VirtualGoodsListPage
