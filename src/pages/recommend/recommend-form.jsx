import { Form, Input, message, Modal, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "../../common/network";
import DebounceSelect from "components/debounce-select";
import HttpStatus from "http-status-codes";
import { useEffect } from "react";

const { Option } = Select;
const RecommendForm = (id, visible, onSave, onCancel) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/admin/v1/recommends/${id}`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            form.setFieldsValue({
              ...res.data,
              bookName: {
                label: res.data.bookName,
                value: res.data.bookId,
              },
            });
          }
        })
        .catch((err) => message.error(`load error:${err.message}`));
    }
  }, [id, form]);

  const fetchBook = async (value) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/admin/v1/books?bookName=${value}&currentPage=1&pageSize=10`)
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const results = res.data;
            const books = results.records;
            const options = books.map((item) => ({
              label: item.bookName,
              value: item.id,
            }));
            resolve(options);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const createData = (values) => {
    axios
      .post(`/api/admin/v1/recommends`, {
        ...values,
        bookName: values.label,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success("操作成功!");
          onSave();
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`);
      });
  };

  const updateData = (values) => {
    axios
      .put(`/api/admin/v1/recommends/${id}`, {
        ...values,
        bookName: values.label,
      })
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          message.success("操作成功!");
          onSave();
        }
      })
      .catch((err) => {
        message.error(`save data failed, reason:${err.message}`);
      });
  };

  const okHandler = () => {
    form
      .validateFields()
      .then((values) => {
        if (id) {
          updateData(values);
        } else {
          createData(values);
        }
      })
      .catch();
  };

  const handleSelectChangeAction = (optionValue) => {
    form.setFieldsValue({
      bookId: optionValue,
    });
  };

  return (
    <Modal
      visible={visible}
      width={640}
      style={{ maxHeight: 500 }}
      title="标签表单"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandler}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item name="bookId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="bookName"
          label="书籍"
          rules={[
            {
              required: true,
              message: "请选择书籍",
            },
          ]}
        >
          <DebounceSelect
            showSearch
            fetchOptions={fetchBook}
            placeholder="请输入书籍名称搜索"
            onChange={({ value }) => handleSelectChangeAction(value)}
          />
        </Form.Item>
        <Form.Item name="recommendType" label="推荐类型">
          <Select>
            <Option value="TODAY">今日推荐</Option>
            <Option value="TOP_SEARCH">热搜推荐</Option>
          </Select>
        </Form.Item>
        <Form.Item name="introduction" label="简介">
          <TextArea rows={3} style={{ resize: "none" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecommendForm;
