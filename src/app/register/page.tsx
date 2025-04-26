"use client";
import { CloudUpload, Visibility, VisibilityOff } from "@mui/icons-material"; // 引入图标
import { Button, CircularProgress, Divider, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material" // 引入所需组件
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from "dayjs"; // 引入 dayjs 和 Dayjs 类型
import { useRouter } from "next/navigation";
import React, { useState } from "react"; // 引入 React

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // 新增: 邮箱状态
  const [birthday, setBirthday] = useState<Dayjs | null>(null); // 新增: 生日状态
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // 新增: 头像文件状态
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // 新增: 头像预览 URL

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      // 创建预览 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  // 点击上传区域时触发隐藏的文件输入框
  const handleUploadClick = () => {
    document.getElementById('avatar-upload-input')?.click();
  };

  // 处理注册逻辑
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => { // 使用 React.FormEvent
    e.preventDefault(); // 阻止表单默认提交行为
    if (!avatarFile) {
      alert("请上传头像");
      return;
    }
    if (!birthday) {
      alert("请选择生日");
      return;
    }

    setLoading(true);

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('birthday', birthday.format('YYYY-MM-DD')); // 格式化日期
    formData.append('avatarFile', avatarFile); // 添加文件

    console.log("准备发送 FormData:", { // 打印将要发送的数据（不含文件内容）
      username,
      password,
      email,
      birthday: birthday.format('YYYY-MM-DD'),
      avatarFileName: avatarFile.name
    });

    try {
      const resp = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        body: formData // 发送 FormData
        // 注意：不需要设置 Content-Type header
      });

      if (resp.ok) { // 检查响应状态码是否为 2xx
        alert("注册成功");
        router.push("/"); // 跳转到登录页或其他页面
      } else {
        // 尝试解析后端的错误信息
        const errorData = await resp.json().catch(() => ({ message: "注册失败，请检查输入信息或联系管理员" }));
        alert(`注册失败: ${errorData.message || resp.statusText}`);
      }
    } catch (error) {
      console.error("注册请求出错:", error);
      alert("注册请求失败，请检查网络连接或联系管理员。");
    } finally {
      setLoading(false); // 无论成功或失败，都结束加载状态
    }
  };

  // 切换密码可见性
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    // 将 LocalizationProvider 包裹在最外层
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Paper elevation={3} className="w-full md:w-3/5 max-w-4xl overflow-hidden rounded-lg"> {/* 添加圆角 */}
          <div className="justify-center flex items-center h-16 bg-primary text-2xl text-white"> {/* 标题栏 */}
            <span>注册新用户</span>
          </div>
          {/* 使用 form 标签包裹 */}
          <form onSubmit={handleRegister}>
            <div className="flex flex-col md:flex-row p-6"> {/* 主内容区域，添加内边距 */}
              {/* 左侧表单 */}
              <div className="flex flex-col justify-center md:w-1/2 md:pr-4 space-y-4"> {/* 左侧容器，添加间距 */}
                <TextField
                  label="用户名"
                  variant="outlined"
                  size="small"
                  value={username}
                  fullWidth
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                  label="密码"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{ // 添加密码可见性切换按钮
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField // 新增: 邮箱输入框
                  label="邮箱"
                  type="email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <DatePicker // 生日选择器
                  label="生日"
                  value={birthday}
                  onChange={(newValue) => setBirthday(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true, required: true } }} // 设置为必填和全宽
                />
              </div>

              {/* 分隔线 */}
              <Divider orientation="vertical" flexItem className="hidden md:block mx-4" /> {/* 垂直分隔线，添加左右边距 */}
              <Divider className="md:hidden my-4" /> {/* 水平分隔线（移动端） */}

              {/* 右侧头像上传 */}
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:pl-4 mt-4 md:mt-0"> {/* 右侧容器 */}
                <Typography variant="subtitle1" className="mb-2"> {/* 提示文字 */}
                  请上传头像
                </Typography>
                {/* 隐藏的文件输入框 */}
                <input
                  type="file"
                  id="avatar-upload-input"
                  accept="image/*" // 限制只能选择图片
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required // 设置为必填
                />
                {/* 可点击的上传区域 */}
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-400 mb-4 flex justify-center items-center w-full h-48 cursor-pointer hover:border-primary rounded-md" // 调整大小、添加手型光标和悬停效果、圆角
                >
                  {avatarPreview ? (
                    // 显示预览图
                    <img src={avatarPreview} alt="头像预览" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                  ) : (
                    // 显示上传图标
                    <CloudUpload sx={{ fontSize: 80, color: 'grey.500' }} />
                  )}
                </div>
                {avatarFile && ( // 显示已选择的文件名
                  <Typography variant="caption" color="textSecondary">已选择: {avatarFile.name}</Typography>
                )}
              </div>
            </div>

            {/* 提交按钮区域 */}
            <div className="p-6 pt-0"> {/* 添加内边距，移除上边距 */}
              <Button
                type="submit" // 类型为 submit
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                className="h-10" // 设置固定高度
                disabled={loading} // loading 状态时禁用按钮
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // loading 时显示加载图标
              >
                {loading ? "注册中..." : "注册"}
              </Button>
            </div>
          </form>

          {/* 底部链接区域 */}
          <div className="bg-gray-100 flex flex-col md:flex-row w-full p-3 border-t border-gray-200"> {/* 调整背景色、内边距和上边框 */}
            <div className="w-full md:w-1/2 text-center my-1 md:my-0">
              <Button variant="text" onClick={() => router.push('/')}>返回登录</Button>
            </div>
            <div className="w-full md:w-1/2 text-center my-1 md:my-0">
              <Button variant="text" onClick={() => router.push('/chpwd')}>修改密码</Button>
            </div>
          </div>
        </Paper>
      </div>
    </LocalizationProvider>
  );
}

export default RegisterPage;