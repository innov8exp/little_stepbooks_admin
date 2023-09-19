import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, message, Modal, Table } from "antd";
import useFetch from "../../common/fetch-hook";
import Axios from "../../common/network";
import { ButtonWrapper } from "../../components/styled";
import HttpStatus from "http-status-codes";
import { useState } from "react";
import TagForm from "./tag-form";

const { confirm } = Modal;

const TagPage = () => {
  const [changeTime, setChangeTime] = useState(Date.now());
  const { loading, fetchedData } = useFetch(`/api/admin/v1/tags`, [changeTime]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const handleEditAction = (id) => {
    setSelectedId(id);
    setFormVisible(true);
  };

  const handleDeleteAction = (id) => {
    confirm({
      title: "确定删除次记录?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      onOk() {
        Axios.delete(`/api/admin/v1/tags/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              message.success("操作成功!");
              setChangeTime(Date.now());
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(err.message);
          });
      },
    });
  };

  return (
    <Card title="标签管理">
      <ButtonWrapper>
        <Button
          type="primary"
          onClick={() => {
            setSelectedId(undefined);
            setFormVisible(true);
          }}
        >
          新建
        </Button>
      </ButtonWrapper>
      <Table
        columns={[
          {
            title: "#",
            key: "number",
            render: (text, record, index) => index + 1,
          },
          {
            title: "标签名称",
            key: "tagName",
            dataIndex: "tagName",
          },
          {
            title: "描述",
            key: "description",
            dataIndex: "description",
          },
          {
            title: "操作",
            key: "action",
            width: 300,
            render: (text, record) => {
              return (
                <div>
                  <Button
                    onClick={() => handleEditAction(record.id)}
                    type="link"
                  >
                    编辑
                  </Button>
                  <Button
                    onClick={() => handleDeleteAction(record.id)}
                    type="link"
                  >
                    删除
                  </Button>
                </div>
              );
            },
          },
        ]}
        rowKey={(record) => record.id}
        dataSource={fetchedData}
        pagination={false}
        loading={loading}
      />
      <TagForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSave={() => {
          setFormVisible(false);
          setChangeTime(Date.now());
        }}
        id={selectedId}
      />
    </Card>
  );
};

export default TagPage;
