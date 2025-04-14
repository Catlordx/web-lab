"use client";
import { CloudUpload } from "@mui/icons-material";
import { Button, CircularProgress, Divider, IconButton, Paper, TextField } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { useState } from "react";

const RegisterPage = () => {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cardId, setCardId] = useState("");
  const [loading, setLoading] = useState(false)

 

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setLoading(true)
    const req_data = {
      username: username,
      cardId: cardId,
      password: password,
    }
    const resp = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data)
    })

    if (resp.status === 201) {
      alert("注册成功")
      setLoading(false)

      router.push("/")
    }
    else {
      alert("注册失败")
      setLoading(false)
    }

  }
  // const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (

    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Paper elevation={3} className="w-full md:w-3/5 max-w-4xl overflow-hidden">
        <div className="justify-center flex items-center h-16 bg-primary text-2xl">
          <span>注册新用户</span>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="px-8 flex flex-col justify-center items-center md:w-1/2">
            <form onSubmit={handleRegister} className="space-y-4 mb-4 md:mb-0">
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
              />

              <TextField
                label="校园卡号"
                variant="outlined"
                size="small"
                fullWidth
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                required
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="w-full">
                    <DatePicker
                      defaultValue={dayjs('2024-04-17')}
                      sx={{
                        width: '100%'
                      }}
                    />
                  </div>
                </LocalizationProvider>
              </LocalizationProvider>
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
          <Divider orientation="vertical" flexItem className="hidden  md:block" />
          <Divider className="md:hidden my-4" />
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
            <span className="mb-2">
              请上传头像
            </span>
            <div className="border-2 border-dashed border-gray-400 mb-4 flex justify-center w-5/6">
              <IconButton aria-label="upload picture" component="span" sx={{ width: 300, height: 160 }}>
                <CloudUpload sx={{ fontSize: 80 }} />
              </IconButton>
            </div>
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
    </div>
  )
}

export default RegisterPage