import {
  DownCircleOutlined,
  ExclamationCircleOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, message, Modal, Table } from "antd";
import useFetch from "../../common/fetch-hook";
import Axios from "../../common/network";
import { ButtonWrapper } from "../../components/styled";
import HttpStatus from "http-status-codes";
import { useState } from "react";
import CategoryForm from "./category-form";

const { confirm } = Modal;

const CategoryPage = () => {
  const [changeTime, setChangeTime] = useState(Date.now());
  const { loading, fetchedData } = useFetch(`/api/admin/v1/categories`, [
    changeTime,
  ]);
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
        Axios.delete(`/api/admin/v1/categories/${id}`)
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

  const handleSortAction = (id, direction) => {
    Axios.put(`/api/admin/v1/categories/${id}/sort`, { direction })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success("change succeed!");
          setChangeTime(Date.now());
        }
      })
      .catch((err) => {
        console.error(err);
        message.error(err.message);
      });
  };

  return (
    <Card title="分类管理">
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
            title: "分类名称",
            key: "categoryName",
            dataIndex: "categoryName",
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
            render: (text, record, index) => {
              return (
                <div>
                  {index === 0 ? (
                    ""
                  ) : (
                    <Button
                      type="link"
                      onClick={() => handleSortAction(record.id, "UP")}
                    >
                      <UpCircleOutlined />
                    </Button>
                  )}

                  {index === fetchedData.length - 1 ? (
                    ""
                  ) : (
                    <Button
                      type="link"
                      onClick={() => handleSortAction(record.id, "DOWN")}
                    >
                      <DownCircleOutlined />
                    </Button>
                  )}

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
      <CategoryForm
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

export default CategoryPage;
