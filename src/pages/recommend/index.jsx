import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, Image, message, Modal, Table, Tag } from 'antd'
import useFetch from '../../hooks/useFetch'
import Axios from '../../libs/network'
import { ButtonWrapper } from '../../components/styled'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import RecommendForm from './form'

const { confirm } = Modal

const RecommendPage = () => {
  const [changeTime, setChangeTime] = useState(Date.now())
  const { loading, fetchedData } = useFetch(`/api/admin/v1/recommends`, [
    changeTime,
  ])
  const [formVisible, setFormVisible] = useState(false)
  const [selectedId, setSelectedId] = useState()

  // const handleEditAction = (id) => {
  //     setSelectedId(id);
  //     setFormVisible(true);
  // };

  const handleDeleteAction = (id) => {
    confirm({
      title: '确定删除次记录?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        Axios.delete(`/api/admin/v1/recommends/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success('操作成功!')
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
    <Card title='首页推荐设置'>
      <ButtonWrapper>
        <Button
          type='primary'
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}>
          新建
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
            title: '书籍',
            key: 'bookName',
            dataIndex: 'bookName',
          },
          {
            title: '书籍封面',
            key: 'coverImg',
            dataIndex: 'coverImg',
            render: (text) => <Image width={50} src={text} />,
          },
          {
            title: '作者',
            key: 'author',
            dataIndex: 'author',
          },
          {
            title: '连载',
            key: 'isSerialized',
            dataIndex: 'isSerialized',
            render: (text) => (text ? '是' : '否'),
          },
          {
            title: '完结',
            key: 'hasEnding',
            dataIndex: 'hasEnding',
            render: (text) => (text ? '是' : '否'),
          },
          {
            title: '推荐类型',
            key: 'recommendType',
            dataIndex: 'recommendType',
            width: 150,
            render: (text) => {
              console.log(text)
              if (text === 'TODAY') {
                return <Tag color='green'>今日推荐</Tag>
              }
              if (text === 'TOP_SEARCH') {
                return <Tag color='green'>热搜推荐</Tag>
              }
              return <span />
            },
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            render: (text, record) => {
              return (
                <div>
                  {/* <Button
                                        onClick={() =>
                                            handleEditAction(record.id)
                                        }
                                        type="link"
                                    >
                                        编辑
                                    </Button> */}
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type='link'>
                    删除
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
      <RecommendForm
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

export default RecommendPage
