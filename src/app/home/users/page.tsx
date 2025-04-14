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
  province: string;
  city: string;
}

const UserManagementPage = () => {

  // 在文件顶部添加
  const provinceData = [
    {
      province: '北京',
      cities: ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '顺义区', '通州区', '大兴区', '房山区', '门头沟区', '昌平区', '平谷区', '密云区', '延庆区']
    },
    {
      province: '上海',
      cities: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '宝山区', '闵行区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
    },
    {
      province: '天津',
      cities: ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区']
    },
    {
      province: '重庆',
      cities: ['万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区']
    },
    {
      province: '河北',
      cities: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水']
    },
    {
      province: '山西',
      cities: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁']
    },
    {
      province: '辽宁',
      cities: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛']
    },
    {
      province: '吉林',
      cities: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边']
    },
    {
      province: '黑龙江',
      cities: ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭']
    },
    {
      province: '江苏',
      cities: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁']
    },
    {
      province: '浙江',
      cities: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水']
    },
    {
      province: '安徽',
      cities: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城']
    },
    {
      province: '福建',
      cities: ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德']
    },
    {
      province: '江西',
      cities: ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶']
    },
    {
      province: '山东',
      cities: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽']
    },
    {
      province: '河南',
      cities: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源']
    },
    {
      province: '湖北',
      cities: ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门', '神农架']
    },
    {
      province: '湖南',
      cities: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西']
    },
    {
      province: '广东',
      cities: ['广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮']
    },
    {
      province: '海南',
      cities: ['海口', '三亚', '三沙', '儋州', '五指山', '琼海', '文昌', '万宁', '东方', '定安', '屯昌', '澄迈', '临高', '白沙', '昌江', '乐东', '陵水', '保亭', '琼中']
    },
    {
      province: '四川',
      cities: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山']
    },
    {
      province: '贵州',
      cities: ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南']
    },
    {
      province: '云南',
      cities: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆']
    },
    {
      province: '陕西',
      cities: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛']
    },
    {
      province: '甘肃',
      cities: ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南']
    },
    {
      province: '青海',
      cities: ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西']
    },
    {
      province: '内蒙古',
      cities: ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒盟', '阿拉善盟']
    },
    {
      province: '广西',
      cities: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左']
    },
    {
      province: '西藏',
      cities: ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里']
    },
    {
      province: '宁夏',
      cities: ['银川', '石嘴山', '吴忠', '固原', '中卫']
    },
    {
      province: '新疆',
      cities: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰', '石河子', '阿拉尔', '图木舒克', '五家渠', '北屯', '铁门关', '双河', '可克达拉', '昆玉']
    },
    {
      province: '香港',
      cities: ['中西区', '湾仔区', '东区', '南区', '油尖旺区', '深水埗区', '九龙城区', '黄大仙区', '观塘区', '北区', '大埔区', '沙田区', '西贡区', '荃湾区', '屯门区', '元朗区', '葵青区', '离岛区']
    },
    {
      province: '澳门',
      cities: ['花地玛堂区', '花王堂区', '望德堂区', '大堂区', '风顺堂区', '嘉模堂区', '路凼填海区', '圣方济各堂区']
    },
    {
      province: '台湾',
      cities: ['台北', '新北', '桃园', '台中', '台南', '高雄', '基隆', '新竹', '嘉义']
    }
  ];
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [users, setUsers] = useState<User[]>(dummyUsers);
  // const [filteredUsers, setFilteredUsers] = useState<User[]>(dummyUsers);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    province: '',
    city: '',
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
        type: user.userType || 'student',
        province: user.province || '',
        city: user.city || ''
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
  const handleAddUser = async () => {
    setLoading(true);
    const updatedUserData = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      province: newUser.province,
      city: newUser.city,
    };
    const resp = await fetch(`http://localhost:8080/api/users`, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUserData)
    })


    // const id = Math.max(...users.map(u => u.id)) + 1;
    // const currentDate = new Date().toISOString().split('T')[0];
    // const user = {
    //   ...newUser,
    //   id,
    //   borrowedBooks: 0,
    //   registrationDate: currentDate
    // } as User;

    // setUsers([...users, user]);
    // setOpenAddDialog(false);
    // showSnackbar('用户添加成功', 'success');
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      province: user.province,
      city: user.city,
    });
    setOpenEditDialog(true);
  };

  // 保存编辑
  // const handleSaveEdit = () => {
  //   if (selectedUser) {
  //     const updatedUsers = users.map(user =>
  //       user.id === selectedUser.id ? { ...user, ...newUser } : user
  //     );
  //     setUsers(updatedUsers);
  //     setOpenEditDialog(false);
  //     showSnackbar('用户信息已更新', 'success');
  //   }
  // };
    const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const updatedUserData = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        province: newUser.province,
        city: newUser.city,
      };
      const respo = await fetch(`http://localhost:8080/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData)
      })
      console.log(respo.body);

      if (!respo.ok) {
        const errorData = await respo.json().catch(() => ({}));
        throw new Error(errorData.message || '更新用户失败');
      }
      // 更新前端状态
      const updatedUser = { ...selectedUser, ...newUser };
      setUsers(users.map(user =>
        user.id === selectedUser.id ? updatedUser : user
      ));
      setFilteredUsers(filteredUsers.map(user =>
        user.id === selectedUser.id ? updatedUser : user
      ));

      setOpenEditDialog(false);
      showSnackbar('用户信息已成功更新', 'success');
    } catch (error: any) {
      showSnackbar(`更新失败: ${error.message}`, 'error');
      console.error('更新用户时出错:', error);
    } finally {
      setLoading(false);
    }
  };


  // 删除用户
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        // 显示加载状态
        setLoading(true);

        // 从 localStorage 获取 token
        const token = localStorage.getItem('authToken');

        // 调用删除用户 API
        const response = await fetch(`http://localhost:8080/api/users/${selectedUser.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // 检查响应
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || '删除用户失败');
        }

        // 前端状态更新
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setFilteredUsers(filteredUsers.filter(user => user.id !== selectedUser.id));

        setOpenDeleteDialog(false);
        showSnackbar('用户已成功删除', 'success');
      } catch (error: any) {
        showSnackbar(`删除失败: ${error.message}`, 'error');
        console.error('删除用户时出错:', error);
      } finally {
        setLoading(false);
      }
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
    // {
    //   field: 'type',
    //   headerName: '用户类型',
    //   flex: 0.9,
    //   minWidth: 100,
    //   headerAlign: 'center',
    //   align: 'center',
    //   renderCell: (params: GridRenderCellParams<User>) => {
    //     const typeColors = {
    //       student: 'primary',
    //       teacher: 'secondary',
    //       staff: 'info',
    //       other: 'default'
    //     };
    //     const type = params.row.type;
    //     return (
    //       <Chip
    //         label={
    //           type === 'student' ? '学生' :
    //             type === 'teacher' ? '教师' :
    //               type === 'staff' ? '职工' : '其他'
    //         }
    //         color={typeColors[type] as any}
    //         size="small"
    //         variant="outlined"
    //       />
    //     );
    //   }
    // },
    // {
    //   field: 'borrowedBooks',
    //   headerName: '借阅数量',
    //   flex: 0.7,
    //   minWidth: 90,
    //   headerAlign: 'center',
    //   align: 'center'
    // },
    {
      field: 'province',
      headerName: '省份',
      flex: 0.8,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'city',
      headerName: '城市',
      flex: 0.8,
      minWidth: 90,
      headerAlign: 'center',
      align: 'center'
    },
    // {
    //   field: 'status',
    //   headerName: '状态',
    //   flex: 0.8,
    //   minWidth: 90,
    //   headerAlign: 'center',
    //   align: 'center',
    //   renderCell: (params: GridRenderCellParams<User>) => {
    //     const statusColors = {
    //       active: 'success',
    //       suspended: 'warning',
    //       blocked: 'error'
    //     };
    //     const status = params.row.status;
    //     return (
    //       <Chip
    //         label={
    //           status === 'active' ? '正常' :
    //             status === 'suspended' ? '暂停' : '锁定'
    //         }
    //         color={statusColors[status] as any}
    //         size="small"
    //       />
    //     );
    //   }
    // },
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
          联系人管理
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
                <InputLabel>省份</InputLabel>
                <Select
                  value={newUser.province || ''}
                  label="省份"
                  onChange={(e) => {
                    const selectedProvince = e.target.value as string;
                    // 更新省份，并清空城市(除非当前城市属于新选的省)
                    const provinceItem = provinceData.find(p => p.province === selectedProvince);
                    const cityExists = provinceItem?.cities.includes(newUser.city || '');

                    setNewUser({
                      ...newUser,
                      province: selectedProvince,
                      city: cityExists ? newUser.city : ''
                    });
                  }}
                >
                  {provinceData.map((p) => (
                    <MenuItem key={p.province} value={p.province}>{p.province}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>城市</InputLabel>
                <Select
                  value={newUser.city || ''}
                  label="城市"
                  disabled={!newUser.province}
                  onChange={(e) => setNewUser({ ...newUser, city: e.target.value as string })}
                >
                  {newUser.province &&
                    provinceData
                      .find(p => p.province === newUser.province)
                      ?.cities.map((city) => (
                        <MenuItem key={city} value={city}>{city}</MenuItem>
                      ))
                  }
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
                <InputLabel>省份</InputLabel>
                <Select
                  value={newUser.province || ''}
                  label="省份"
                  onChange={(e) => {
                    const selectedProvince = e.target.value as string;
                    // 更新省份，并清空城市(除非当前城市属于新选的省)
                    const provinceItem = provinceData.find(p => p.province === selectedProvince);
                    const cityExists = provinceItem?.cities.includes(newUser.city || '');

                    setNewUser({
                      ...newUser,
                      province: selectedProvince,
                      city: cityExists ? newUser.city : ''
                    });
                  }}
                >
                  {provinceData.map((p) => (
                    <MenuItem key={p.province} value={p.province}>{p.province}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>城市</InputLabel>
                <Select
                  value={newUser.city || ''}
                  label="城市"
                  disabled={!newUser.province}
                  onChange={(e) => setNewUser({ ...newUser, city: e.target.value as string })}
                >
                  {newUser.province &&
                    provinceData
                      .find(p => p.province === newUser.province)
                      ?.cities.map((city) => (
                        <MenuItem key={city} value={city}>{city}</MenuItem>
                      ))
                  }
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
                <Typography variant="body2" color="text.secondary">省份</Typography>
                <Typography variant="body1">{selectedUser.province}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">城市</Typography>
                <Typography variant="body1">{selectedUser.city}</Typography>
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