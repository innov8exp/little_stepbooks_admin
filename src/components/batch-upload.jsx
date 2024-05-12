import { Button, Modal, Table, Image, App } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { ButtonWrapper } from '@/components/styled'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const BatchUploadList = ({
    visible = false,
    domain = 'DEFAULT',
    permission = 'PUBLIC',
    mediaType = 'AUDIO',
    onAdd = (data) => {
      console.log(data)
    },
    onOk = (data) => {
      console.log(data)
    },
    onErr = (err) => {
      console.error(err)
    },
    onCancel = (err) => {
      console.error(err)
    },
}) => {
    let uploadingCount = 0
    const inputAccept = (mediaType === 'AUDIO' ? '.mp3,.m4a' : '.mp4') + ',.png,.jpg,.jpeg'
    const [columns, setColumns] = useState([])
    const { t } = useTranslation()
    const { modal } = App.useApp()
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const fileNameMap = {};

    useEffect(() => {
        if (visible) {
            uploadingCount = 0
            setFileList([])
            const typeName = t(mediaType);
            modal.confirm({
                width: 600,
                content: 
                    <div>
                        <div style={{ lineHeight: 1.8 }}>请选择{typeName}和封面，同一{typeName}和其对应的封面命名需相同。<br /><span style={{ color: '#f00' }}>排序和名字通过下划线 “_” 相连</span></div>
                        <div>
                            <img src="/images/batch_sample.jpg" alt="" style={{ display: 'block', width: '100%', height: 'auto' }} />
                        </div>
                    </div>,
                okText: t(mediaType === 'AUDIO' ? 'button.selectAudioAndImg' : 'button.selectVideoAndImg'),
                onOk: () => {
                    document.getElementById('batch_media_input').click()
                }
            })
            const tableColumns = [
                {
                    title: `${t('title.sortIndex')}`,
                    key: 'sortIndex',
                    dataIndex: 'sortIndex',
                },
                {
                    title: `${t('title.name')}`,
                    key: 'name',
                    dataIndex: 'name',
                },
                {
                    title: `${t('title.cover')}`,
                    key: 'coverUrl',
                    dataIndex: 'coverUrl',
                    render: (text) => text && <Image height={50} src={text} />,
                },
                {
                    title: `${t('title.operate')}`,
                    key: 'action',
                    width: 100,
                    render: (text, record, index) => {
                        return (
                            <Button onClick={() => handleDeleteAction(index)} type="link">
                                {t('button.delete')}
                            </Button>
                        )
                    },
                },
            ]
            const insertItem = mediaType === 'AUDIO' ? {
                title: `${t('title.audio')}`,
                key: 'audioName',
                dataIndex: 'audioName',
            } : {
                title: `${t('title.video')}`,
                key: 'videoName',
                dataIndex: 'videoName',
            };
            tableColumns.splice(2, 0, insertItem)
            setColumns(tableColumns)
        }
    }, [visible])

    // 检查上传任务
    const checkJobResult = () => {
        setLoading(false)
        const allSuccess = fileList.every(item => item.status === 'success')
        if(allSuccess){
            onOk()
        }else{
            onErr()
        }
    }

    // 开始执行批量上传任务
    const startUploadJob = () => {
        setLoading(true)
        addUploadJob()
    }

    const addUploadJob = () => {
        fileList.some(item => {
            if(item.status === 'pending'){
                handleUpload(item)
                return uploadingCount >= 3
            }else{
                return false
            }
        })
    }

    const fileUpload = (file) => {
        const fmData = new FormData()
        const url = `/api/admin/v1/medias/upload?permission=${permission}&domain=${domain}`
        const options = {
            headers: { 'content-type': 'multipart/form-data' }
        }
        fmData.append('file', file)
        return new Promise(function(resolve, reject){
            return axios.post(url, fmData, options).then((res) => {
                if (res.status === HttpStatus.OK) {
                    resolve(res.data)
                }else{
                    reject('error')
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }

    const getMediaDuration = (file) => {
        if(!file){
            return Promise.resolve(null)
        }
        const url = URL.createObjectURL(file);
        // audio可获取视频或音频的时长
        const audioCtx = new Audio(url);
        return new Promise((resolve) => {
            audioCtx.addEventListener("loadedmetadata", () => {
                const duration = Math.ceil(audioCtx.duration);
                let minute = Math.floor(duration / 60)
                minute = minute > 9 ? minute : '0' + minute;
                let second = duration % 60
                second = second > 9 ? second : '0' + second;
                resolve(`${minute}:${second}`)
            });
        })
    }

    const handleUpload = async (fileItem) => {
        fileItem.status = 'uploading'
        uploadingCount++
        setFileList(fileList.map(item => item))
        const resMap = {
            name: fileItem.name,
            sortIndex: fileItem.sortIndex,
            duration: await getMediaDuration(fileItem.audio || fileItem.video)
        };
        if(fileItem.photo){
            const res = await fileUpload(fileItem.photo)
            resMap.photoId = res.id
            resMap.photoUrl = res.objectUrl
        }
        if(fileItem.audio){
            const res = await fileUpload(fileItem.audio)
            resMap.audioId = res.id
            resMap.audioUrl = res.objectUrl
        }
        if(fileItem.video){
            const res = await fileUpload(fileItem.video)
            resMap.videoId = res.id
            resMap.videoUrl = res.objectUrl
        }
        onAdd(resMap).then(() => {
            fileItem.status = 'success'
        }).catch(() => {
            fileItem.status = 'error'
        }).then(() => {
            setFileList(fileList.map(item => item))
            uploadingCount--
            addUploadJob()
            if(uploadingCount === 0){
                checkJobResult()
            }
        })
    }

    const handleAddAction = (e) => {
        const files = e.target.files
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const fileName = file.name
            let [index, name] = fileName.split('_');
            if(!fileName.includes('_') || isNaN(index)){ // 存在命名不符合规范的
                modal.error({
                    content: <div>文件命名不符合规范，请参考：<span style={{ color: '#f00' }}>01_图片名.jpg</span> 格式命名，其中数字部分代表了排序，数字与名字通过下划线相连，封面名称与视频/音频命名相同。</div>
                })
                return;
            }
            index = index * 1;
            name = name.split('.')[0];
            if(!fileNameMap[name]){
                fileNameMap[name] = { sortIndex: index * 1, status: 'pending', name }
            }
            if(file.type.includes('image/')){
                fileNameMap[name].coverUrl = URL.createObjectURL(file)
                fileNameMap[name].photo = file
                fileNameMap[name].photoName = file.name
            }else if(file.type.includes('video/')){
                fileNameMap[name].video = file
                fileNameMap[name].videoName = file.name
            }else if(file.type.includes('audio/')){
                fileNameMap[name].audio = file
                fileNameMap[name].audioName = file.name
            }
        }
        const arr = Object.keys(fileNameMap).map(name => fileNameMap[name])
        arr.sort((a, b) => a.sortIndex - b.sortIndex)
        setFileList(arr)
    }

    const handleDeleteAction = (index) => {
        const newList = fileList.filter((item, idx) => idx != index)
        setFileList(newList)
    }

    return (
        <Modal
            open={visible}
            width="90%"
            style={{ maxWidth: '1200px' }}
            title={t('button.batchUpload')}
            okText={t('button.startUpload')}
            cancelText={t('button.cancel')}
            onCancel={onCancel}
            onOk={startUploadJob}
        >
            <ButtonWrapper>
                <Button type="primary">
                    <input id='batch_media_input' type="file" multiple accept={inputAccept} onChange={handleAddAction} style={{ 
                        opacity: 0,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%'
                    }} />
                    {t( mediaType === 'AUDIO' ? 'button.addAudio' : 'button.addVideo')}
                </Button>
            </ButtonWrapper>
            <Table
                columns={columns}
                rowKey={(record) => record.name}
                dataSource={fileList}
                loading={loading}
            />
        </Modal>
    )
}

BatchUploadList.propTypes = {
    visible: PropTypes.bool,
    domain: PropTypes.string,
    permission: PropTypes.string,
    mediaType: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onOk: PropTypes.func,
    onErr: PropTypes.func,
    onCancel: PropTypes.func,
}

export default BatchUploadList
