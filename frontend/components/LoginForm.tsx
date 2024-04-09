"use client";
import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const onFinish = async (values: any) => {
    try {
      const response = await fetch(`http://localhost:4000/api/login`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 2000,
        });
        document.cookie = `jwtauth=${result.token}; path=/; max-age=${result.expiryTime}`;
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        console.log("FAILED");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[300px]">
      <Form
        name="normal_login"
        size="large"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            className="border border-black"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            className="border border-black"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="text"
            loading={loading}
            htmlType="submit"
            className="w-full bg-gray-700 tracking-wider text-white uppercase"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
