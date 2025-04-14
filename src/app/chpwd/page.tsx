"use client";
import { Alert, Button, Divider, Paper, Snackbar, TextField } from "@mui/material"
import { useState } from "react"
import { useRouter } from "next/navigation";

const ChangePasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace useSnackbar with direct state management
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showMessage("新密码和确认密码不一致", "error");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("http://localhost:8080/api/users/chpwd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        showMessage(data.message || "修改密码失败", "error");
      } else {
        showMessage("修改密码成功", "success");
        setTimeout(() => router.push("/"), 1500);
      }
    } catch (error) {
      showMessage("请求失败，请检查网络连接", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Paper elevation={3} className="w-full md:w-3/5 max-w-4xl overflow-hidden">
        <div className="justify-center flex items-center h-16 bg-primary text-2xl">
          <span>修改密码</span>
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Left side form */}
          <div className="px-8 flex flex-col justify-center items-center md:w-1/2">
            <form className="space-y-4 mb-4 md:mb-0">
              <TextField
                label="用户名"
                variant="outlined"
                size="small"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <TextField
                label="旧密码"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                size="small"
                fullWidth
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </form>
          </div>

          {/* Dividers */}
          <Divider orientation="vertical" flexItem className="hidden md:block" />
          <Divider className="md:hidden my-4" />

          {/* Right side form */}
          <div className="px-8 flex flex-col justify-center items-center md:w-1/2">
            <form className="space-y-4 mt-4 md:mt-0">
              <TextField
                label="请输入新密码"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                size="small"
                value={newPassword}
                fullWidth
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <TextField
                label="请再次确认密码"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                size="small"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </form>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="mt-4 bg-gray-400 flex flex-col md:flex-row md:mt-2 w-full">
          <div className="w-full md:w-1/2 text-center mt-0 md:my-2">
            <Button
              variant="text"
              sx={{ color: "white" }}
              onClick={() => router.push("/")}
            >
              返回登录
            </Button>
          </div>

          <div className="w-full md:w-1/2 text-center mb-0 md:my-2">
            <Button
              variant="text"
              sx={{ color: 'white' }}
              onClick={handleChangePassword}
              disabled={loading}
            >
              修改密码
            </Button>
          </div>
        </div>
      </Paper>

      {/* Notification */}
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
  )
}

export default ChangePasswordPage