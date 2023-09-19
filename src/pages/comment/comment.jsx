import {
  ExclamationCircleOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Table,
} from "antd";
// import { Routes } from "../../common/config";
import axios from "../../common/network";
import {
  ConditionLeftItem,
  ContentContainer,
  QueryBtnWrapper,
  StyledRightCondition,
} from "../../components/styled";
import HttpStatus from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";

const { confirm } = Modal;

const CommentPage = () => {
  const [queryForm] = Form.useForm();
  //   const history = useHistory();
  const [changeTimestamp, setChangeTimestamp] = useState();
  const [commentsData, setCommentsData] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setQueryCriteria] = useState();

  const paginationProps = {
    pageSize,
    current: pageNumber,
    total,
    onChange: (current) => {
      setPageNumber(current);
    },
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    const searchURL = `/api/admin/v1/comments/search?currentPage=${pageNumber}&pageSize=${pageSize}`;
    axios
      .get(searchURL)
      .then((res) => {
        if (res && res.status === HttpStatus.OK) {
          const responseObject = res.data;
          setCommentsData(responseObject.records);
          setTotal(responseObject.total);
        }
      })
      .catch((err) =>
        message.error(`操作失败，原因：${err.response?.data?.message}`)
      )
      .finally(() => setLoading(false));
  }, [pageNumber, pageSize]);

  const handleDeleteAction = (id) => {
    confirm({
      title: "确定删除当前记录？",
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      okType: "primary",
      cancelText: "取消",
      onOk() {
        axios
          .delete(`/api/admin/v1/comments/${id}`)
          .then((res) => {
            if (res.status === HttpStatus.OK) {
              setChangeTimestamp(Date.now());
              message.success("操作成功!");
            }
          })
          .catch((err) => {
            message.error(`操作失败，原因：${err.response?.data?.message}`);
          });
      },
    });
  };

  const handleQuery = () => {
    const timestamp = new Date().getTime();
    setChangeTimestamp(timestamp);
    const queryValue = queryForm.getFieldsValue();
    setQueryCriteria(queryValue);
  };

  const handleReset = () => {
    queryForm.resetFields();
  };

  // const handleEditAction = (id) => {
  //     history.push(`${Routes.main.routes.bookForm.path}?id=${id}`);
  // };

  useEffect(() => {
    fetchData();
  }, [fetchData, pageNumber, changeTimestamp]);

  return (
    <Card title="评论管理">
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        form={queryForm}
        initialValues={{ category: "", status: "" }}
      >
        <Row>
          <Col span={6}>
            <Form.Item label="书籍名称" name="bookName">
              <Input placeholder="请输入书籍名称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="用户" name="nickname">
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider style={{ marginTop: 0, marginBottom: 10 }} dashed />
      <ContentContainer>
        <StyledRightCondition>
          <QueryBtnWrapper>
            <ConditionLeftItem>
              <Button
                icon={<UndoOutlined />}
                type="default"
                onClick={handleReset}
              >
                重置
              </Button>
            </ConditionLeftItem>
            <ConditionLeftItem>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                onClick={handleQuery}
              >
                查询
              </Button>
            </ConditionLeftItem>
          </QueryBtnWrapper>
        </StyledRightCondition>
        <Table
          columns={[
            {
              title: "#",
              key: "number",
              render: (text, record, index) =>
                (pageNumber - 1) * pageSize + index + 1,
            },
            {
              title: "用户名",
              key: "username",
              dataIndex: "username",
            },
            {
              title: "用户昵称",
              key: "nickname",
              dataIndex: "nickname",
            },
            {
              title: "用户头像",
              key: "avatarImg",
              dataIndex: "avatarImg",
              render: (text) => <Image width={30} src={text} />,
            },
            {
              title: "书籍",
              key: "bookName",
              dataIndex: "bookName",
            },
            {
              title: "评论内容",
              key: "content",
              dataIndex: "content",
            },
            {
              title: "操作",
              key: "action",
              render: (text, record) => {
                return (
                  <div>
                    {/* <Button
                                            type="link"
                                            onClick={() =>
                                                handleEditAction(record.id)
                                            }
                                        >
                                            编辑
                                        </Button> */}

                    <Divider type="vertical" />
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteAction(record.id)}
                    >
                      删除
                    </Button>
                  </div>
                );
              },
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={commentsData}
          loading={loading}
          pagination={paginationProps}
        />
      </ContentContainer>
    </Card>
  );
};

export default CommentPage;
