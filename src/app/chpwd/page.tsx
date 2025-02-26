"use client";
import { Button, Divider, Paper, TextField } from "@mui/material"
import { useState } from "react";

const ChangePasswordPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    return (

        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Paper elevation={3} className="w-3/5 max-w-4xl overflow-hidden">
                <div className="justify-center flex items-center h-16 bg-primary text-2xl">
                    <span>修改密码</span>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="px-8 flex flex-col justify-center items-center md:w-1/2">
                        <form className="space-y-4 mb-4 md:mb-0">
                            <TextField
                                label="用户名"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                            />

                            <TextField
                                label="旧密码"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </form>
                    </div>
                    <Divider orientation="vertical" flexItem className="hidden  md:block" />
                    <Divider className="md:hidden my-4" />
                    <div className="px-8 flex flex-col justify-center items-center md:w-1/2">
                        <form className="space-y-4 mt-4 md:mt-0">
                            <TextField
                                label="用户名"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                            />

                            <TextField
                                label="旧密码"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
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
    )
}

export default ChangePasswordPage