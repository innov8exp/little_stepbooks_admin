import { App, Button, Card, message, Table, Image, Switch,Typography } from 'antd'
import http from '@/libs/http'
import { useState, useEffect } from 'react'
import EditForm from '@/components/edit-form'
import CatRelativeForm from './virtual-relative'
import DetailImages from '@/components/detail-images'
import { useTranslation } from 'react-i18next'
import {
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { Paragraph } = Typography;

const VirtualCatListPage = () => {
  const editFormKeys = [
    { type:'input', key: 'name'},
    { type:'textarea', key: 'description', required: false},
    { type:'photo', key: 'coverUrl', groupKeys:['coverId'], required: false},
    { type:'select', key: 'parentId', selectorType: 'virtualParentCategory', required: false, addOnly: true },
    { type:'number', min: 0, max: 99999, key: 'sortIndex'},
    { type:'radio.group', key: 'status', label: 'title.status', options: [
      { value: 'ONLINE', label: 'ON_SHELF' },
      { value: 'OFFLINE', label: 'OFF_SHELF' },
    ], editOnly: true },
    { type:'boolean', checkedLabel: 'free', unCheckedLabel: 'notFree', key: 'free', label: 'freeOrNot'},
  ]
  const apiPath = 'virtual-category'
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [relativeVisible, setRelativeVisible] = useState(false)
  const [currentRelative, setCurrentRelative] = useState({})
  const [listData, setListData] = useState([])
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [includeChildren, setIncludeChildren] = useState(true)
  const [detailImageEditVisible, setDetailImageEditVisible] = useState(false)
  const [editDetailImgForm, setEditDetailImgForm] = useState({})
  const [switchLoading, setSwitchLoading] = useState({})
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
    const searchURL = `${apiPath}?currentPage=1&pageSize=10&includeChildren=true`
    http.get(searchURL).then((data) => {
        const { records, total } = data;
        setListData(records)
        setTotal(total)
        setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const loadListData = function (currentPage, include) {
    currentPage = currentPage || pageNumber
    include = include != undefined ? include : includeChildren
    setLoading(true)
    const searchURL = `${apiPath}?currentPage=${pageNumber}&pageSize=${pageSize}&includeChildren=${include}`
    http.get(searchURL).then((data) => {
        const responseObject = data
        setPageNumber(currentPage)
        setListData(responseObject.records)
        setTotal(responseObject.total)
      }).catch((err) =>
        message.error(
          `${t('message.error.failureReason')}${err.response?.data?.message}`,
        ),
      )
      .finally(() => {
        setLoading(false)
      })
  }

  const reloadListData = function (include){
    setIncludeChildren(include)
    setPageNumber(1)
    loadListData(1, include)
  }

  const handleAddAction = () => {
    setEditData({
        free: false
    })
    setEdiVisible(true)
  }

  const handleEditAction = (item) => {
    setEdiVisible(true)
    setEditData(item)
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        http.delete(`${apiPath}/${id}`)
          .then(() => {
            message.success(t('message.successInfo'))
            loadListData()
          })
          .catch((err) => {
            message.error(err)
          })
      },
    })
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
        http.post(`${apiPath}/${id}/${status}`)
          .then(() => {
            message.success(t('message.successInfo'))
            loadListData()
          })
          .catch((err) => {
            message.error(err)
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

  const handleDetailImageEdit = (item) => {
    setEditDetailImgForm({
      ...item,
      detailImgName: `${item.name}的详情图`
    })
    setDetailImageEditVisible(true)
  }

  const onCatRelativeRemove = (record) => {
    http.delete(`/virtual-category-product/category/${record.id}`).then(() => {
      loadListData()
    })
  }

  const onDetailImgSave = (detailImgId) => {
    if(!editDetailImgForm.detailImgId){ // 编辑的对象不存在详情图关联
      http.put(`${apiPath}/${editDetailImgForm.id}`, {
        detailImgId
      }).then(() => {
        setDetailImageEditVisible(false)
        loadListData()
      })
    }else{
      setDetailImageEditVisible(false)
    }
  }

  const onDetailImgCancel = () => {
    setDetailImageEditVisible(false)
  }

  const onRelativeClick = (record) => {
    const data = {
      categoryId: record.id,
      categoryName: record.parent ? `${record.parent.name} - ${record.name}` : record.name,
      id: null,
      productId: null,
      skuName: '',
      displayTime: null
    }
    if(record.virtualCategoryProduct){
      data.displayTime = record.virtualCategoryProduct.displayTime;
      data.productId = record.virtualCategoryProduct.productId;
      data.id = data.productId;
      data.skuName = record.relativeProduct ? record.relativeProduct.skuName : data.productId;
    }
    setCurrentRelative(data)
    setRelativeVisible(true)
  }

  return (
    <Card title={(
        <div>
            <span>{t('virtualGoodsCat')}</span>
            <Switch
                checkedChildren={t('showChildren')}
                unCheckedChildren={t('hideChildren')}
                checked={includeChildren}
                style={{ width: 100, marginLeft: 20 }}
                onClick={reloadListData}
            />
        </div>
    )} extra={
      <Button type="primary" onClick={handleAddAction}>
        {t('button.create')}
      </Button>
    }>
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
            render: (text, record) => record.parent ? `${record.parent.name} - ${text}` : text,
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
            title: `${t('sortIndex')}`,
            key: 'sortIndex',
            dataIndex: 'sortIndex',
            width: 80
          },
          {
            title: `${t('freeOrNot')}`,
            key: 'free',
            dataIndex: 'free',
            render: (text) => text ? t('yes') : t('no'),
          },
          {
            title: `${t('relativeProduct')}`,
            key: 'relativeProduct',
            dataIndex: 'relativeProduct',
            render: (text, record) => {
              if(record.relativeProduct){
                return (
                  <>
                    <div>{record.relativeProduct.skuName}</div>
                    <div>
                      <Button type='link' onClick={() => onCatRelativeRemove(record)}>{ t('remove') }</Button>
                    </div>
                  </>
                )
              }else{
                return <Button icon={<PlusOutlined />} onClick={() => onRelativeClick(record)}></Button>
              }
            },
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
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
                  checked={text === 'ONLINE'}
                  style={{
                    width: '70px'
                  }}
                  loading={
                    switchLoading.id === record.id && switchLoading.loading
                  }
                  onClick={(checked) =>
                    handleUpdateStatusAction(
                      record.id,
                      checked ? 'online' : 'offline',
                    )
                  }
                />
              )
            },
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 120,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleDetailImageEdit(record)}
                    type="link"
                  >
                    {t('detailImage')}
                  </Button>
                  <Button
                    onClick={() => handleEditAction(record)}
                    type="link"
                    disabled={ record.status === 'ONLINE' }
                  >
                    {t('button.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    {t('button.delete')}
                  </Button>
                  <Paragraph copyable={{ text: `packageAudio/book-detail/index?id=${record.id}` }}>
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
        visible={ediVisible}
        apiPath={apiPath}
        domain='PRODUCT'
        title='virtualGoodsCat'
        formData={editData}
        formKeys={editFormKeys}
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
      {
        relativeVisible ? 
        <CatRelativeForm
          visible={relativeVisible}
          currentData={currentRelative}
          onSave={() => {
            setRelativeVisible(false)
            loadListData()
          }}
          onCancel={() => {
            setRelativeVisible(false)
          }}
        /> : null
      }
    </Card>
  )
}

export default VirtualCatListPage
