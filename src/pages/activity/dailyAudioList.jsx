import { Button, Card, message, Table } from 'antd'
import http from '@/libs/http'
import { useState, useEffect } from 'react'
import DailyAudioForm from './daily-audio-form'
import { useTranslation } from 'react-i18next'

const DailyAudioListPage = () => {
  const apiPath = 'daily-audio'
  const { t } = useTranslation()
  const [listData, setListData] = useState([])
  const [endCats, setEndCats] = useState([]);
  const [ediVisible, setEdiVisible] = useState(false)
  const [editData, setEditData] = useState({})
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
    const searchURL = `/${apiPath}?currentPage=1&pageSize=10`
    http.get(searchURL).then((res) => {
      const { records, total } = res
      setListData(records)
      setTotal(total)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const loadListData = function (currentPage) {
    currentPage = currentPage || pageNumber
    setLoading(true)
    const searchURL = `/${apiPath}?currentPage=${currentPage}&pageSize=${pageSize}`
    http.get(searchURL).then((res) => {
      const { records, total } = res
      setListData(records)
      setTotal(total)
      setPageNumber(currentPage)
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      message.error(err)
    })
  }

  const handleAddAction = () => {
    fetchAllCats().then(() => {
      setEdiVisible(true)
      setEditData({})
    })
  }

  // const handleEditAction = (item) => {
  //   fetchAllCats().then(() => {
  //     setEdiVisible(true)
  //     setEditData(item)
  //   })
  // }

  const fetchAllCats = () => {
    if(endCats.length > 0){
        return Promise.resolve()
    }
    return http.get('/virtual-category?includeChildren=true&currentPage=1&pageSize=1000').then(res => {
        const catMap = { }
        const parentIds = { }
        res.records.forEach(item => {
            catMap[item.id] = item
            if(item.parentId){
                parentIds[item.parentId] = true
            }
        })
        const options = res.records.filter(item => !parentIds[item.id]).map(item => {
            // 如果存在父类，那么名字上包含父类名字
            if(item.parentId){
                item.name = `${catMap[item.parentId].name}-${item.name}`
            }
            return item
        })
        setEndCats(options.sort((a, b) => a.name < b.name ? -1 : 1))
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <Card title={t('dailyAudioList')} extra={
      <Button type="primary" onClick={handleAddAction}>
        {t('set')}
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
            title: `${t('audio')}`,
            key: 'fullName',
            dataIndex: 'fullName',
          },
          {
            title: `${t('startDate')}`,
            key: 'day',
            dataIndex: 'day',
          },
          {
            title: `${t('endDate')}`,
            key: 'endDay',
            dataIndex: 'endDay',
          },
          {
            title: `${t('title.creationTime')}`,
            key: 'createdAt',
            dataIndex: 'createdAt',
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={listData}
        loading={loading}
        pagination={paginationProps}
      />
      <DailyAudioForm
        visible={ediVisible}
        editData={editData}
        endCats={endCats}
        onCancel={() => setEdiVisible(false)}
        onSave={() => {
          setEdiVisible(false)
          loadListData()
        }}
      />
    </Card>
  )
}

export default DailyAudioListPage
