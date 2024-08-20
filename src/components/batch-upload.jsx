import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button, Modal, Table, Image, App } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'
import { ButtonWrapper } from '@/components/styled'
import React, { useState, useEffect } from 'react'
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
    const { t } = useTranslation()
    const { modal } = App.useApp()
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)

    const Row = (props) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
          // eslint-disable-next-line react/prop-types
          id: props['data-row-key'],
        });
        const style = {
          // eslint-disable-next-line react/prop-types
          ...props.style,
          transform: CSS.Translate.toString(transform),
          transition,
          cursor: 'move',
          ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
              }
            : {}),
        };
        return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    };
    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
            distance: 1,
          },
        }),
    );

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setFileList((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex)
            });
        }
    };

    useEffect(() => {
        if (visible) {
            setFileList([])
            let arr = [
                '三个小小人.mp4',
                '三个小小人.jpg',
                '中国古代神话.mp4',
                '中国古代神话.jpg',
                '孙子兵法.mp4',
                '孙子兵法.jpg',
            ]
            if(mediaType === 'AUDIO'){
                arr = arr.map(item => item.replace('mp4', 'mp3'))
            }
            const content = (
                <div>
                    <div>{t(mediaType === 'AUDIO' ? 'message.audioBatchNotice' : 'message.videoBatchNotice')}</div>
                    <div style={{ marginTop: 10, padding: 15, backgroundColor: '#f6f6f6' }}>
                        {arr.map(name => <div key={name}>{name}</div>)}
                    </div>
                </div>
            )
            modal.confirm({
                width: 600,
                content,
                okText: t(mediaType === 'AUDIO' ? 'button.selectAudioAndImg' : 'button.selectVideoAndImg'),
                onOk: () => {
                    document.getElementById('batch_media_input').click()
                }
            })
        }
    }, [mediaType, modal, t, visible])

    // 开始执行批量上传任务
    const startUploadJob = () => {
        let emptyArr = [];
        fileList.forEach(item => {
            if(mediaType === 'AUDIO' && !item.audioName){
                emptyArr.push(`《${item.name}》`)
                return true
            }
            if(mediaType === 'VIDEO' && !item.videoName){
                emptyArr.push(`《${item.name}》`)
            }
        })
        if(emptyArr.length > 0){
            const emptyMsg = <div>{t('pleaseAdd')}<span style={{ color: 'red' }}>{emptyArr.join('、')}</span>{t(mediaType === 'AUDIO' ? 'deAudioFile' : 'deVideoFile')}</div>
            modal.error({
                width: 600,
                content: emptyMsg,
                okText: t('button.determine'),
                onOk: () => {
                    document.getElementById('batch_media_input').click()
                }
            })
        }else{
            setLoading(true)
            addUploadJob()
        }
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

    const saveData = async () => {
        for (const item of fileList) {
            item.params && await onAdd(item.params)
        }
        setLoading(false)
        onOk()
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
        const params = {
            name: fileItem.name,
            duration: await getMediaDuration(fileItem.audio || fileItem.video)
        };
        if(fileItem.photo){
            const res = await fileUpload(fileItem.photo)
            params.photoId = res.id
            params.photoUrl = res.objectUrl
        }
        if(fileItem.audio){
            const res = await fileUpload(fileItem.audio)
            params.audioId = res.id
            params.audioUrl = res.objectUrl
        }
        if(fileItem.video){
            const res = await fileUpload(fileItem.video)
            params.videoId = res.id
            params.videoUrl = res.objectUrl
        }
        fileItem.status = 'uploaded'
        fileItem.params = params
        setFileList(fileList.map(item => item))
        uploadingCount--
        const isAllFinish = fileList.every(item => item.status === 'uploaded')
        if(isAllFinish){ // 全部资源上传完毕，进入下一步，执行数据的添加到数据库中
            saveData()
        }else{
            addUploadJob()
        }
    }

    const handleAddAction = (e) => {
        const nameMap = {}
        fileList.forEach(item => {
            nameMap[item.name] = item
        })
        const files = e.target.files
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const nameArr = file.name.split('.');
            const name = nameArr.slice(0, nameArr.length - 1).join('.');
            if(!nameMap[name]){
                nameMap[name] = { 
                    key: name,
                    name,
                    status: 'pending',
                }
            }
            if(file.type.includes('image/')){
                nameMap[name].coverUrl = URL.createObjectURL(file)
                nameMap[name].photo = file
                nameMap[name].photoName = file.name
            }else if(file.type.includes('video/')){
                nameMap[name].video = file
                nameMap[name].videoName = file.name
            }else if(file.type.includes('audio/')){
                nameMap[name].audio = file
                nameMap[name].audioName = file.name
            }
        }
        const arr = Object.keys(nameMap).map((name) => nameMap[name])
        setFileList(arr)
    }

    const handleDeleteAction = (delItem) => {
        const newList = fileList.filter((item) => item.key != delItem.key)
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
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    items={fileList.map((i) => i.name)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        components={{
                            body: { row: Row },
                        }}
                        rowKey="key"
                        columns={[
                            {
                                title: `${t('title.sortIndex')}`,
                                key: 'sortIndex',
                                dataIndex: 'sortIndex',
                                render: (text, record, index) => index + 1,
                            },
                            {
                                title: `${t('title.name')}`,
                                key: 'name',
                                dataIndex: 'name',
                            },
                            {
                                title: `${t('audioOrVideo')}`,
                                key: 'fileName',
                                dataIndex: 'fileName',
                                render: (text, record) => record.audioName || record.videoName,
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
                                render: (text, record) => {
                                    return (
                                        <Button onClick={() => handleDeleteAction(record)} type="link">
                                            {t('button.delete')}
                                        </Button>
                                    )
                                },
                            },
                        ]}
                        dataSource={fileList}
                        loading={loading}
                    />
                </SortableContext>
            </DndContext>
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
