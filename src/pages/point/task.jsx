import { App, Button, Card, message, Table, Switch, Input } from 'antd'
import dayjs from 'dayjs'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState, useEffect } from 'react'
import EditForm from '@/components/edit-form'
import { useTranslation } from 'react-i18next'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons'


const PointTaskListPage = () => {
  const dateFormat = 'YYYY-MM-DD'
  const apiPath = 'points-task'
  const { t } = useTranslation()
  const { modal } = App.useApp()
  const [queryName, setQueryName] = useState(null)
  const [listData, setListData] = useState([])
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [switchLoading, setSwitchLoading] = useState({})
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
    const searchURL = `/api/admin/v1/${apiPath}?currentPage=1&pageSize=10`
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
  }, [])

  const loadListData = function (currentPage) {
    currentPage = currentPage || pageNumber
    setLoading(true)
    let searchURL = `/api/admin/v1/${apiPath}?currentPage=${pageNumber}&pageSize=${pageSize}`
    if(queryName){
      searchURL += `&name=${queryName}`
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

  const handleAddAction = () => {
    setEdiVisible(true)
    setEditData({})
  }

  const handleEditAction = (item) => {
    let dateRange = null;
    let jumpType = 1;
    let catId, productId;
    if(item.actionUrl.includes('virtualCategory')){
      jumpType = 2
      catId = item.actionUrl.split('id=')[1]
    }else if(item.actionUrl.includes('product')){
      jumpType = 3
      productId = item.actionUrl.split('id=')[1]
    }
    if(item.type === 'SPECIAL'){
      dateRange = [dayjs(item.startDate), dayjs(item.endDate)]
    }
    setEdiVisible(true)
    setEditData({
      ...item,
      dateRange,
      jumpType,
      catId,
      productId
    })
  }

  const saveDataFormat = data => {
    console.log(data)
    const [startDate, endDate] = data.type === 'SPECIAL' ? [
      data.dateRange[0].format(dateFormat),
      data.dateRange[1].format(dateFormat),
    ] : ['', '']
    let actionUrl = null;
    if(data.jumpType === 1){
      actionUrl = 'StepBook://local/dailyAudio'
    }else if(data.jumpType === 2){
      actionUrl = `StepBook://local/virtualCategory?id=${data.catId}`
    }else {
      actionUrl = `StepBook://local/product?id=${data.productId}`
    }
    const params = {
      ...data,
      actionUrl,
      startDate,
      endDate
    }
    delete params.catId
    delete params.productId
    delete params.jumpType
    delete params.dateRange
    return params
  }

  const handleDeleteAction = (id) => {
    modal.confirm({
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios.delete(`/api/admin/v1/${apiPath}/${id}`)
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

  const handleUpdateStatusAction = (id, active) => {
    setSwitchLoading({ id, loading: true })
    modal.confirm({
      title: `${t('message.tips.changeStatus')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .put(`/api/admin/v1/${apiPath}/${id}`, { active })
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


  return (
    <Card title={t('pointTask')} extra={
      <Button type="primary" onClick={handleAddAction}>
        {t('button.create')}
      </Button>
    }>
      <div style={{marginBottom: '15px'}}>
        <Input placeholder={t('message.placeholder.name')} style={{ width: 200, marginRight: 15 }} onChange={e => setQueryName(e.target.value)} allowClear />
        <Button icon={<SearchOutlined />} type="primary" onClick={() => loadListData()}>{t('button.search')} </Button>
      </div>
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
            title: `${t('taskType')}`,
            key: 'type',
            dataIndex: 'type',
            render: (text) => t(text === 'DAILY' ? 'dailyTask' : 'specialTask')
          },
          {
            title: `${t('title.startTime')}`,
            key: 'startDate',
            dataIndex: 'startDate',
            render: (text, record) => record.type === 'DAILY' ? '--' : text
          },
          {
            title: `${t('title.endTime')}`,
            key: 'endDate',
            dataIndex: 'endDate',
            render: (text, record) => record.type === 'DAILY' ? '--' : text
          },
          {
            title: `${t('successHint')}`,
            key: 'successHint',
            dataIndex: 'successHint',
          },
          {
            title: `${t('point')}`,
            key: 'points',
            dataIndex: 'points',
          },
          {
            title: `${t('taskUrl')}`,
            key: 'actionUrl',
            dataIndex: 'actionUrl',
            width: 180
          },
          {
            title: `${t('title.status')}`,
            key: 'active',
            dataIndex: 'active',
            render: (text, record) => {
              return (
                <Switch
                  checkedChildren={t('online')}
                  unCheckedChildren={t('offline')}
                  checked={text}
                  style={{
                    width: '70px'
                  }}
                  loading={
                    switchLoading.id === record.id && switchLoading.loading
                  }
                  onClick={(checked) =>
                    handleUpdateStatusAction(
                      record.id,
                      checked,
                    )
                  }
                />
              )
            },
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
          {
            title: `${t('title.operate')}`,
            key: 'action',
            width: 90,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record)}
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
        dataSource={listData}
        loading={loading}
        pagination={paginationProps}
      />
      <EditForm
        visible={ediVisible}
        apiPath={apiPath}
        domain='PRODUCT'
        title='pointTask'
        formData={editData}
        formKeys={[
          { type:'input', key: 'name' },
          { type:'radio.group', key: 'type', label: 'taskType', options: [
            { value: 'DAILY', label: t('dailyTask') },
            { value: 'SPECIAL', label: t('specialTask') },
          ] },
          { type:'dateRangePicker', key: 'dateRange', label: 'startEndDate', hiddenControl: {
            key: 'type',
            handler: (value) => value !== 'SPECIAL'
          }},
          { type:'radio.group', key: 'jumpType', label: 'taskJumpType', options: [
            { value: 1, label: t('listenDailyAudio') },
            { value: 2, label: t('viewVirtualGoods') },
            { value: 3, label: t('viewProduct') },
          ]},
          { type:'select', selectorType: 'virtualCategory', key: 'catId', label: 'product', hiddenControl: {
            key: 'jumpType',
            handler: value => value !== 2
          }},
          { type:'select', selectorType: 'product', key: 'productId', label: 'product', hiddenControl: {
            key: 'jumpType',
            handler: value => value !== 3
          }},
          { type:'number', min: 1, max: 999999, key: 'points', label: 'point' },
          { type:'textarea', key: 'successHint', required: false },
        ]}
        saveDataFormat={saveDataFormat}
        onCancel={() => setEdiVisible(false)}
        onSave={() => {
          setEdiVisible(false)
          loadListData()
        }}
      />
    </Card>
  )
}

export default PointTaskListPage
