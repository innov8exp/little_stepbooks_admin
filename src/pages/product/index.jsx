import { App, Button, Card, message, Table, Image, Form, Row, Input, Select, Switch, Tag, Typography } from 'antd'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import DetailImages from '@/components/detail-images'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EditForm from '@/components/edit-form'
import { useTranslation } from 'react-i18next'

const { Paragraph } = Typography;

const ProductListPage = () => {
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const [listData, setListData] = useState([])
  const [ediVisible, setEdiVisible] = useState(false)
  const [detailImageEditVisible, setDetailImageEditVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [queryForm] = Form.useForm()
  const [classifications, setClassifications] = useState([])
  const [editDetailImgForm, setEditDetailImgForm] = useState({})
  const [switchLoading, setSwitchLoading] = useState({})
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
    const searchURL = `/api/admin/v1/products?currentPage=1&pageSize=10`
    axios.get(searchURL).then((res) => {
      if (res && res.status === HttpStatus.OK) {
        const { records, total } = res.data;
        setListData(records)
        setTotal(total)
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })
    axios.get('/api/admin/v1/classifications').then(res => {
      if (res && res.status === HttpStatus.OK) {
        setClassifications(res.data.map(({id, classificationName}) => ({ value: id, label: classificationName })))
      }
    })
  }, [])

  const loadListData = function (currentPage) {
    currentPage = currentPage || pageNumber
    setLoading(true)
    let queryStr = ''
    const queryData = queryForm.getFieldsValue()
    for (const key in queryData) {
      if(queryData[key]){
        queryStr += `&${key}=${encodeURIComponent(queryData[key])}`
      }
    }
    const searchURL = `/api/admin/v1/products?currentPage=${currentPage}&pageSize=${pageSize}` + queryStr
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data
          setListData(responseObject.records)
          setTotal(responseObject.total)
          setPageNumber(currentPage)
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

  const handleReset = () => {
    queryForm.resetFields()
  }

  const handleAddAction = () => {
    setEdiVisible(true)
    setEditData({
      medias: []
    })
  }

  const handleEditAction = (id) => {
    axios.get('/api/admin/v1/products/' + id).then(res => {
      if (res && res.status === HttpStatus.OK) {
        setEdiVisible(true)
        const { medias, tags } = res.data;
        setEditData({
          id,
          ...res.data,
          medias: medias ? medias.map(item => ({
            imgId: item.mediaId,
            imgUrl: item.mediaUrl
          })) : [],
          tags: tags ? tags.split(',') : null
        })
      }
    })
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios.delete(`/api/admin/v1/products/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              loadListData()
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
      },
    })
  }

  const handleDetailImageEdit = (item) => {
    setEditDetailImgForm({
      id: item.id,
      detailImgId: item.detailImgId,
      detailImgName: `${item.skuName}的详情图`
    })
    setDetailImageEditVisible(true)
  }

  const onDetailImgCancel = () => {
    setDetailImageEditVisible(false)
  }

  const onDetailImgSave = (id) => {
    if(!editDetailImgForm.detailImgId){ // 编辑的对象不存在详情图关联
      axios.put(`/api/admin/v1/products/${editDetailImgForm.id}/change-detail-img?detailImgId=${id}`).then(() => {
        setDetailImageEditVisible(false)
        loadListData()
      })
    }else{
      setDetailImageEditVisible(false)
    }
  }

  const handleUpdateStatusAction = (id, status) => {
    setSwitchLoading({ id, loading: true })
    modal.confirm({
      title: `${t('message.tips.changeStatus')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/products/${id}/status/${status}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
              loadListData()
            }
          })
          .catch((err) => {
            console.error(err)
            message.error(err.message)
          })
          .finally(() => {
            setSwitchLoading({ id, loading: false })
          })
      },
      onCancel() {
        setSwitchLoading({ id, loading: false })
      }
    })
  }

  // 商品价格、上下线
  const handleSkuClick = id => {
    navigate('/product-sku-list/' + id)
  }

  return (
    <Card title={t('menu.skuList')} extra={
      <Button type="primary" onClick={handleAddAction}  style={{ float: 'right' }}>
        {t('button.create')}
      </Button>
    }>
      <Form form={queryForm}>
        <Row>
            <Form.Item label={t('name')} name="skuName">
              <Input placeholder={t('message.placeholder.name')} />
            </Form.Item>
            <Form.Item label={t('title.status')} name="status" style={{ margin: '0 15px', width: 200 }}>
              <Select placeholder={t('message.placeholder.pleaseSelect')} options={[
                { value: 'ON_SHELF', label: t('ON_SHELF') },
                { value: 'OFF_SHELF', label: t('OFF_SHELF') }
              ]} />
            </Form.Item>
            <Button icon={<SearchOutlined />} type="primary" onClick={() => loadListData()} style={{ margin: '0 15px' }}>{t('button.search')} </Button>
            <Button icon={<UndoOutlined />} onClick={handleReset}>{t('button.reset')} </Button>
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
            key: 'skuName',
            dataIndex: 'skuName',
          },
          {
            title: `${t('title.description')}`,
            key: 'description',
            dataIndex: 'description',
          },
          {
            title: `${t('title.cover')}`,
            key: 'coverImgUrl',
            dataIndex: 'coverImgUrl',
            render: (text) => <Image width={60} height={45} src={text} />,
          },
          {
            title: `${t('title.video')}`,
            key: 'videoUrl',
            dataIndex: 'videoUrl',
            render: (text) => {
              return(
                  text ?
                  <video
                    style={{
                        width: '160px',
                        height: '90px'
                    }}
                    src={ text }
                    controls
                  ></video>
                  : ''
              )
            },
          },
          {
            title: `${t('tags')}`,
            key: 'tags',
            dataIndex: 'tags',
            render: (text) => {
              if(text){
                return text.split(',').map(tag => <Tag key={tag}>{tag}</Tag>)
              }else{
                return null
              }
            },
          },
          {
            title: `${t('sortIndex')}`,
            key: 'sortIndex',
            dataIndex: 'sortIndex',
            width: 80
          },
          {
            title: `${t('title.status')}`,
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => {
              return (
                <Switch
                  checkedChildren={t('ON_SHELF')}
                  unCheckedChildren={t('OFF_SHELF')}
                  checked={text === 'ON_SHELF'}
                  style={{
                    width: '70px'
                  }}
                  loading={
                    switchLoading.id === record.id && switchLoading.loading
                  }
                  onClick={(checked) =>
                    handleUpdateStatusAction(
                      record.id,
                      checked ? 'ON_SHELF' : 'OFF_SHELF',
                    )
                  }
                />
              )
            },
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
                    {t(record.status === 'ON_SHELF' ? 'view' : 'button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                    disabled={record.status === 'ON_SHELF'}
                  >
                    {t('button.delete')}
                  </Button>
                  <Button
                    onClick={() => handleDetailImageEdit(record)}
                    type="link"
                  >
                    {t('detailImage')}
                  </Button>
                  <Button
                    onClick={() => handleSkuClick(record.id)}
                    type="link"
                  >
                    {t('skuAndPrice')}
                  </Button>
                  <Paragraph copyable={{ text: `pages/product/product-detail/product-detail?id=${record.id}` }}>
                    <span className='app_color'>{t('miniProgramPath')}</span>
                  </Paragraph>
                </div>
              )
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={listData}
        loading={loading}
        pagination={paginationProps}
      />
      <EditForm
        disabled={(editData && editData.status === 'ON_SHELF') ? true : false}
        visible={ediVisible}
        apiPath='products'
        domain='PRODUCT'
        title='product'
        formData={editData}
        labelSpan={5}
        formKeys={[
          { type:'input', key: 'skuName', label: 'name'},
          { type:'textarea', key: 'description', required: false},
          { type:'photo', key: 'coverImgUrl', label: 'coverImage', groupKeys:['coverImgId']},
          { type:'video', key: 'videoUrl', groupKeys:['videoId'], required: false },
          { type:'photo-list', key: 'medias', label: 'topBanner', format: value => value.map(item => ({
            mediaId: item.imgId,
            mediaUrl: item.imgUrl
          }))},
          { type:'checkbox.group', key: 'classificationIds', label: 'title.classification', options: classifications },
          { type:'checkbox.group', key: 'parsedSalesPlatforms', label: 'platform', options: [
            { value: 'MINI_PROGRAM', label: t('MINI_PROGRAM') },
            { value: 'APP', label: t('APP') },
          ]},
          { type:'checkbox.group', key: 'tags', options: [
            { value: '图书', label: '图书' },
            { value: '文创', label: '文创' },
            { value: '课程', label: '课程' },
            { value: '训练营', label: '训练营' },
          ], format: value => value ? value.join(',') : null},
          { type:'number', min: 0, max: 99999, key: 'sortIndex'},
        ]}
        onCancel={() => setEdiVisible(false)}
        onSave={() => {
          setEdiVisible(false)
          loadListData()
        }}
      />
      <DetailImages
        visible={detailImageEditVisible}
        id={editDetailImgForm.detailImgId}
        detailName={editDetailImgForm.detailImgName}
        onSave={onDetailImgSave}
        onCancel={onDetailImgCancel}
      />
    </Card>
  )
}

export default ProductListPage
