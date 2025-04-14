"use client";
import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { QQIcon, AlipayIcon, WeChatIcon } from "../components/icons";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userStore";


const App = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const setUser = useUserStore((state) => state.setUser);
  // const user = useUserStore((state) => state.user)
  // 添加到现有state定义中
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // 处理通知关闭
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // console.log("Login with:", username, password);
    setError("")
    if (!username.trim()) {
      setError("请输入用户名")
      return;
    }
    if (!password) {
      setError("请输入密码")
      return;
    }
    setLoading(true)
    const req_data = {
      username: username,
      password: password,
      type: "username"
    }
    const resp = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data)
    });

    const data = await resp.json();
    if (!resp.ok) {
      setError(data.message);
      // 显示登录失败提示
      setNotification({
        open: true,
        message: data.message || "登录失败，请稍后再试",
        severity: 'error'
      });
      setLoading(false)
      return;
    }
    setUsername(data.username)
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      console.log(localStorage.getItem('authToken'));
      console.log(data);

      setUser({
        name: data.username,
        email: data.email,
        phone: data.phonenumber,
      })


      // 显示登录成功提示
      setNotification({
        open: true,
        message: '登录成功！正在跳转...',
        severity: 'success'
      });

      // 延迟跳转，让用户能看到成功提示
      setTimeout(() => {
        router.push('/home')
      }, 500);
      setLoading(false)
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Paper elevation={3} className="w-full md:w-1/2 max-w-4xl overflow-hidden">
        <div className="justify-center flex items-center h-16 bg-primary text-2xl">
          <span>登录</span>
        </div>
        <div className="flex flex-col md:flex-row">
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
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}
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
                loading={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-4 bg-gray-400 flex flex-col md:flex-row md:mt-2 w-full">
          <div className="w-full md:w-1/2 text-center mt-0 md:my-2">
            <Button variant="text" sx={{ color: "white" }}>注册用户</Button>
          </div>

          <div className="w-full md:w-1/2 text-center mb-0 md:my-2">
            <Button variant="text" sx={{ color: 'white' }}>修改密码</Button>
          </div>
        </div>
      </Paper>
      {/* 添加到return语句的最后 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default App;