"use client";
import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { QQIcon, AlipayIcon, WeChatIcon } from "./components/icons";


const App = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Login with:", username, password);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Paper elevation={3} className="w-full max-w-4xl overflow-hidden">
        <div className="justify-center flex items-center h-16 bg-primary text-2xl">
          <span>登录</span>
        </div>
        <div className="flex flex-col md:flex-row">
          {/* 社交登录部分 - 在小屏幕上在上方显示 */}
          <div className="px-8 flex flex-col justify-center items-center space-y-4 md:w-1/2 mb-4 md:mb-0">
            <Button
              variant="outlined"
              color="primary"
              className="flex items-center justify-center w-full h-10"
              onClick={() => handleSocialLogin("alipay")}
              startIcon={<AlipayIcon />}
            >
              <span className="md:inline">支付宝登录</span>
            </Button>

            <Button
              variant="outlined"
              color="success"
              className="flex items-center justify-center w-full h-10"
              onClick={() => handleSocialLogin("wechat")}
              startIcon={<WeChatIcon />}
            >
              <span className="md:inline">微信登录</span>
            </Button>

            <Button
              variant="outlined"
              color="info"
              className="flex items-center justify-center w-full h-10"
              onClick={() => handleSocialLogin("qq")}
              startIcon={<QQIcon />}
            >
              <span className="md:inline">QQ登录</span>
            </Button>
          </div>

          {/* 中间分隔线 */}
          <Divider orientation="vertical" flexItem className="hidden  md:block" />
          <Divider className="md:hidden my-4" />

          {/* 账号密码登录部分 */}
          <div className="px-8 flex flex-col justify-center items-center md:w-1/2 mt-4 md:mt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <TextField
                label="用户名"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10"
                sx={{ pb: 0, pt: 0 }}
                required
              />

              <TextField
                label="密码"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className="mt-6 h-10"
              >
                登录
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-4 bg-gray-400 flex flex-col md:flex-row w-full">
          <div className="w-full md:w-1/2 text-center my-2">
            <Button variant="text" sx={{ color: "white" }}>注册用户</Button>
          </div>

          <div className="w-full md:w-1/2 text-center my-2">
            <Button variant="text" sx={{ color: 'white' }}>修改密码</Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default App;