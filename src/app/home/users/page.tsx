/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  borrowedBooks: number;
  status: 'active' | 'suspended' | 'blocked';
  type: 'student' | 'teacher' | 'staff' | 'other';
}

const UserManagementPage = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [users, setUsers] = useState<User[]>(dummyUsers);
  // const [filteredUsers, setFilteredUsers] = useState<User[]>(dummyUsers);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    type: 'student'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('网络错误，请稍后再试');
      }
      const data = await response.json();
      const formattedUsers: User[] = data.map((user: any) => ({
        id: user.cardId,
        name: user.name,
        email: user.email || '',
        phone: user.phone || '',
        borrowedBooks: user.borrowedBooks || 0,
        status: user.status || 'active',
        type: user.userType || 'student'
      }))

      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (err: any) {
      setError(err.message || '获取用户数据时出错');
      showSnackbar('获取用户数据失败: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // 过滤用户数据
  useEffect(() => {
    fetchUsers();
  }, [])
  // useEffect(() => {
  //   let result = users;

  //   // 搜索过滤
  //   if (search) {
  //     const searchLower = search.toLowerCase();
  //     result = result.filter(user =>
  //       user.name.toLowerCase().includes(searchLower) ||
  //       user.email.toLowerCase().includes(searchLower)
  //     );
  //   }

  //   // 状态过滤
  //   if (statusFilter !== 'all') {
  //     result = result.filter(user => user.status === statusFilter);
  //   }

  //   setFilteredUsers(result);
  // }, [users, search, statusFilter]);

  // 打开添加用户对话框
  const handleAddUserClick = () => {
    setNewUser({
      name: '',
      email: '',
      phone: '',
      status: 'active',
      type: 'student'
    });
    setOpenAddDialog(true);
  };

  // 添加用户
  const handleAddUser = () => {
    const id = Math.max(...users.map(u => u.id)) + 1;
    const currentDate = new Date().toISOString().split('T')[0];
    const user = {
      ...newUser,
      id,
      borrowedBooks: 0,
      registrationDate: currentDate
    } as User;

    setUsers([...users, user]);
    setOpenAddDialog(false);
    showSnackbar('用户添加成功', 'success');
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      type: user.type
    });
    setOpenEditDialog(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (selectedUser) {
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id ? { ...user, ...newUser } : user
      );
      setUsers(updatedUsers);
      setOpenEditDialog(false);
      showSnackbar('用户信息已更新', 'success');
    }
  };

  // 删除用户
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setOpenDeleteDialog(false);
      showSnackbar('用户已删除', 'success');
    }
  };

  // 查看用户详情
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setOpenDetailsDialog(true);
  };

  // 显示提示消息
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // 表格列定义
  // 表格列定义 - 使用flex属性实现响应式列宽
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.7,
      minWidth: 80,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'name',
      headerName: '姓名',
      flex: 0.8,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'email',
      headerName: '电子邮件',
      flex: 1.8,
      minWidth: 180
    },
    {
      field: 'phone',
      headerName: '电话',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'type',
      headerName: '用户类型',
      flex: 0.9,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<User>) => {
        const typeColors = {
          student: 'primary',
          teacher: 'secondary',
          staff: 'info',
          other: 'default'
        };
        const type = params.row.type;
        return (
          <Chip
            label={
              type === 'student' ? '学生' :
                type === 'teacher' ? '教师' :
                  type === 'staff' ? '职工' : '其他'
            }
            color={typeColors[type] as any}
            size="small"
            variant="outlined"
          />
        );
      }
    },
    {
      field: 'borrowedBooks',
      headerName: '借阅数量',
      flex: 0.7,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'status',
      headerName: '状态',
      flex: 0.8,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<User>) => {
        const statusColors = {
          active: 'success',
          suspended: 'warning',
          blocked: 'error'
        };
        const status = params.row.status;
        return (
          <Chip
            label={
              status === 'active' ? '正常' :
                status === 'suspended' ? '暂停' : '锁定'
            }
            color={statusColors[status] as any}
            size="small"
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: '操作',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<User>) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, width: '100%' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleViewDetails(params.row)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditUser(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];
  // const columns: GridColDef[] = [
  //   { field: 'id', headerName: 'ID', width: 100 },
  //   { field: 'name', headerName: '姓名', width: 70 },
  //   { field: 'email', headerName: '电子邮件', width: 180 },
  //   { field: 'phone', headerName: '电话', width: 130 },
  //   {
  //     field: 'type',
  //     headerName: '用户类型',
  //     width: 100,
  //     renderCell: (params: GridRenderCellParams<User>) => {
  //       const typeColors = {
  //         student: 'primary',
  //         teacher: 'secondary',
  //         staff: 'info',
  //         other: 'default'
  //       };
  //       const type = params.row.type;
  //       return (
  //         <Chip
  //           label={
  //             type === 'student' ? '学生' :
  //               type === 'teacher' ? '教师' :
  //                 type === 'staff' ? '职工' : '其他'
  //           }
  //           color={typeColors[type] as any}
  //           size="small"
  //           variant="outlined"
  //         />
  //       );
  //     }
  //   },
  //   { field: 'borrowedBooks', headerName: '借阅数量', width: 100 },
  //   {
  //     field: 'status',
  //     headerName: '状态',
  //     width: 100,
  //     renderCell: (params: GridRenderCellParams<User>) => {
  //       const statusColors = {
  //         active: 'success',
  //         suspended: 'warning',
  //         blocked: 'error'
  //       };
  //       const status = params.row.status;
  //       return (
  //         <Chip
  //           label={
  //             status === 'active' ? '正常' :
  //               status === 'suspended' ? '暂停' : '锁定'
  //           }
  //           color={statusColors[status] as any}
  //           size="small"
  //         />
  //       );
  //     }
  //   },
  //   {
  //     field: 'actions',
  //     headerName: '操作',
  //     width: 150,
  //     renderCell: (params: GridRenderCellParams<User>) => (
  //       <Box>
  //         <IconButton
  //           size="small"
  //           color="primary"
  //           onClick={() => handleViewDetails(params.row)}
  //         >
  //           <VisibilityIcon fontSize="small" />
  //         </IconButton>
  //         <IconButton
  //           size="small"
  //           color="primary"
  //           onClick={() => handleEditUser(params.row)}
  //         >
  //           <EditIcon fontSize="small" />
  //         </IconButton>
  //         <IconButton
  //           size="small"
  //           color="error"
  //           onClick={() => handleDeleteClick(params.row)}
  //         >
  //           <DeleteIcon fontSize="small" />
  //         </IconButton>
  //       </Box>
  //     )
  //   }
  // ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          <AccountBoxIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          用户管理
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleAddUserClick}
        >
          添加用户
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="搜索用户"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">用户状态</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="用户状态"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="active">正常</MenuItem>
              <MenuItem value="suspended">暂停</MenuItem>
              <MenuItem value="blocked">锁定</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            localeText={{
              MuiTablePagination: {
                labelRowsPerPage: '每页行数:',
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from}-${to} 共 ${count !== -1 ? count : `超过 ${to}`}`
              },
              toolbarDensity: '密度',
              toolbarDensityLabel: '密度',
              toolbarDensityCompact: '紧凑',
              toolbarDensityStandard: '标准',
              toolbarDensityComfortable: '舒适',
              toolbarColumns: '列',
              toolbarColumnsLabel: '选择列',
              toolbarFilters: '筛选器',
              toolbarFiltersLabel: '显示筛选器',
              toolbarFiltersTooltipHide: '隐藏筛选器',
              toolbarFiltersTooltipShow: '显示筛选器',
              toolbarQuickFilterPlaceholder: '搜索...',
              toolbarExport: '导出',
              toolbarExportLabel: '导出',
              toolbarExportCSV: '导出为CSV',
              toolbarExportPrint: '打印',
              // columnsPanelTextFieldLabel: '查找列',
              // columnsPanelTextFieldPlaceholder: '列名',
              // columnsPanelDragIconLabel: '重排列',
              // columnsPanelShowAllButton: '显示所有',
              // columnsPanelHideAllButton: '隐藏所有',
              // ...更多本地化文本
            }}
          />

        </Box>

      </Paper>

      {/* 添加用户对话框 */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加新用户</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            请填写新用户的信息。
          </DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="姓名"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <TextField
              label="电子邮件"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <TextField
              label="电话"
              fullWidth
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>用户类型</InputLabel>
                <Select
                  value={newUser.type}
                  label="用户类型"
                  onChange={(e) => setNewUser({ ...newUser, type: e.target.value as any })}
                >
                  <MenuItem value="student">学生</MenuItem>
                  <MenuItem value="teacher">教师</MenuItem>
                  <MenuItem value="staff">职工</MenuItem>
                  <MenuItem value="other">其他</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={newUser.status}
                  label="状态"
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                >
                  <MenuItem value="active">正常</MenuItem>
                  <MenuItem value="suspended">暂停</MenuItem>
                  <MenuItem value="blocked">锁定</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>取消</Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={!newUser.name || !newUser.email}
          >
            添加
          </Button>
        </DialogActions>
      </Dialog>

      {/* 编辑用户对话框 */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>编辑用户</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="姓名"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <TextField
              label="电子邮件"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <TextField
              label="电话"
              fullWidth
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>用户类型</InputLabel>
                <Select
                  value={newUser.type}
                  label="用户类型"
                  onChange={(e) => setNewUser({ ...newUser, type: e.target.value as any })}
                >
                  <MenuItem value="student">学生</MenuItem>
                  <MenuItem value="teacher">教师</MenuItem>
                  <MenuItem value="staff">职工</MenuItem>
                  <MenuItem value="other">其他</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={newUser.status}
                  label="状态"
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                >
                  <MenuItem value="active">正常</MenuItem>
                  <MenuItem value="suspended">暂停</MenuItem>
                  <MenuItem value="blocked">锁定</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>取消</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!newUser.name || !newUser.email}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除用户 {selectedUser?.name} 吗？此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>取消</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 用户详情对话框 */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>用户详情</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="h6">{selectedUser.name}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">ID</Typography>
                <Typography variant="body1">{selectedUser.id}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">电子邮件</Typography>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">电话</Typography>
                <Typography variant="body1">{selectedUser.phone}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">用户类型</Typography>
                <Chip
                  label={
                    selectedUser.type === 'student' ? '学生' :
                      selectedUser.type === 'teacher' ? '教师' :
                        selectedUser.type === 'staff' ? '职工' : '其他'
                  }
                  color={
                    selectedUser.type === 'student' ? 'primary' :
                      selectedUser.type === 'teacher' ? 'secondary' :
                        selectedUser.type === 'staff' ? 'info' : 'default'
                  }
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">状态</Typography>
                <Chip
                  label={
                    selectedUser.status === 'active' ? '正常' :
                      selectedUser.status === 'suspended' ? '暂停' : '锁定'
                  }
                  color={
                    selectedUser.status === 'active' ? 'success' :
                      selectedUser.status === 'suspended' ? 'warning' : 'error'
                  }
                  size="small"
                />
              </Box>


              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">当前借阅</Typography>
                <Typography variant="body1">{selectedUser.borrowedBooks} 本</Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ borderBottom: '1px solid #eee', pt: 2, pb: 0.5 }}>
                借阅历史
              </Typography>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  暂无借阅历史记录
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDetailsDialog(false)}
            variant="outlined"
            fullWidth
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示信息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagementPage;