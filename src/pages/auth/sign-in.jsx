import { useState } from "react";
import { Button, Form, Input } from "antd";
// import HttpStatus from "http-status-codes";
// import Axios from "../../common/network";
// import { useSession } from "../../common/session-context";
import AuthLayout from "../../auth-layout";
import { useStore } from "../../common/zustand";
import {
  AuthCard,
  CardHeader,
  LabelText,
  CustomFormItem,
  LabelWrapper,
  MainTitle,
  SubTitle,
} from "src/components/auth-styled";
import { Link } from "react-router-dom";

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
      <AuthCard
        bodyStyle={{ padding: "48px", margin: "0 auto" }}
        bordered={false}
      >
        <CardHeader>
          <MainTitle>步印童书</MainTitle>
          <SubTitle>Little Step Books Admin System</SubTitle>
        </CardHeader>
        <Form
          layout="vertical"
          requiredMark={false}
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label={<LabelText>{"邮箱"}</LabelText>}
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <CustomFormItem
            name="password"
            label={
              <LabelWrapper>
                <LabelText>{"密码"}</LabelText>
                <Link to={"/sign-up"}>{"忘记密码？"}</Link>
              </LabelWrapper>
            }
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input.Password size="large" />
          </CustomFormItem>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              block
              style={{ borderRadius: "4px", height: "40px" }}
            >
              {"登录"}
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignInLayout;
