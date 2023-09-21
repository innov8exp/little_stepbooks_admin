import { useState } from "react";
import { Button, Card, Form, Input } from "antd";
// import HttpStatus from "http-status-codes";
// import Axios from "../../common/network";
// import { useSession } from "../../common/session-context";
import AuthLayout from "../../auth-layout";
import { useStore } from "../../common/zustand";

const SignInLayout = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // const { login, getUserInfo } = useSession();
  const { userInfo, getUserInfo } = useStore((state) => state);

  const onFinish = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        getUserInfo(values);
        console.log(values, "-------------更新后-------------------", userInfo);

        // Axios.post("/api/admin/auth/login", { ...values })
        //   .then((res) => {
        //     if (res.status === HttpStatus.OK) {
        //       console.log("he");
        //       getUserInfo().then((data) => {
        //         const userInfoStr = atob(data);
        //         console.log("userstr:", data);
        //         const userInfo = JSON.parse(
        //           decodeURIComponent(escape(userInfoStr))
        //         );
        //         console.log(userInfo);
        //         const newSession = {
        //           ...userInfo,
        //         };
        //         login(newSession);
        //       });
        //     }
        //   })
        //   .catch(() => message.error("邮箱地址或密码错误，请重新输入！"))
        //   .finally(() => setLoading(false));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLayout>
      <Card
        title="登陆"
        bordered={false}
        headStyle={{ width: 350, textAlign: "center" }}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: "请输入邮箱地址" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
            <Button
              style={{ paddingLeft: 50, paddingRight: 50 }}
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              登陆
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthLayout>
  );
};

export default SignInLayout;
