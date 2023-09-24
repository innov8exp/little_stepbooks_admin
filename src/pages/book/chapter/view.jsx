import { useEffect, useState } from 'react'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { Modal, Spin } from 'antd'

const ChapterViewPage = (id, visible, onClose) => {
  const [content, setContent] = useState()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!id) {
      return
    }
    setLoading(true)
    axios
      .get(`/api/admin/v1/chapters/${id}/content`)
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          setContent(res.data)
        }
      })
      .finally(() => setLoading(false))
  }, [id, visible])

  return (
    <Modal
      open={visible}
      title='预览'
      onCancel={() => {
        setContent('')
        onClose()
      }}
      footer={false}
      width={800}
      mask
      style={{ position: 'relative' }}>
      <Spin spinning={loading}>
        <div style={{ whiteSpace: 'pre-line', overflowY: 'auto' }}>
          {content}
        </div>
      </Spin>
    </Modal>
  )
}

export default ChapterViewPage
