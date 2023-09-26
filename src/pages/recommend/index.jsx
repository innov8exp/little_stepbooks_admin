import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, Image, message, Modal, Table, Tag } from 'antd'
import useFetch from '@/hooks/useFetch'
import { ButtonWrapper } from '@/components/styled'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import RecommendForm from './form'
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

const RecommendPage = () => {
  const { t } = useTranslation()
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
      title: `${t('message.tips.delete')}`,
      icon: <ExclamationCircleOutlined />,
      okText: `${t('button.determine')}`,
      okType: 'primary',
      cancelText: `${t('button.cancel')}`,
      onOk() {
        axios
          .delete(`/api/admin/v1/recommends/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success(t('message.successInfo'))
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
    <Card title={t('title.homepageRecommendedSettings')}>
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => {
            setSelectedId(undefined)
            setFormVisible(true)
          }}
        >
          {t('button.create')}
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
            title: `${t('title.name')}`,
            key: 'bookName',
            dataIndex: 'bookName',
          },
          {
            title: `${t('title.bookCover')}`,
            key: 'coverImg',
            dataIndex: 'coverImg',
            render: (text) => <Image width={50} src={text} />,
          },
          {
            title: `${t('title.author')}`,
            key: 'author',
            dataIndex: 'author',
          },
          {
            title: `${t('title.publishInInstalments')}`,
            key: 'isSerialized',
            dataIndex: 'isSerialized',
            render: (text) =>
              text ? `${t('radio.label.yes')}` : `${t('radio.label.deny')}`,
          },
          {
            title: `${t('title.end')}`,
            key: 'hasEnding',
            dataIndex: 'hasEnding',
            render: (text) =>
              text ? `${t('radio.label.yes')}` : `${t('radio.label.deny')}`,
          },
          {
            title: `${t('title.recommendType')}`,
            key: 'recommendType',
            dataIndex: 'recommendType',
            width: 150,
            render: (text) => {
              console.log(text)
              if (text === 'TODAY') {
                return (
                  <Tag color="green">
                    {t('select.option.TodayRecommendation')}
                  </Tag>
                )
              }
              if (text === 'TOP_SEARCH') {
                return (
                  <Tag color="green">
                    {t('select.option.hotSearchRecommendations')}
                  </Tag>
                )
              }
              return <span />
            },
          },
          {
            title: `${t('title.operate')}`,
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
