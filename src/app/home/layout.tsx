'use client';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaletteIcon from '@mui/icons-material/Palette';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from 'next/link';
import { Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { TuneOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  }
})

let usedTheme = lightTheme

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1000
    }
    return true
  })
  React.useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 1000)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  }
  const menuItems = [
    { text: '首页', icon: <DashboardIcon />, path: '/home' },
    { text: '联系人管理', icon: <PeopleIcon />, path: '/home/users' },
    { text: '功能菜单', icon: <TuneOutlined />, path: '/home/articles' },
    { text: '设置', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Add below the existing menu state variables (around line 118)
  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState<null | HTMLElement>(null);
  const settingsMenuOpen = Boolean(settingsAnchorEl);

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };
  const router = useRouter();
  const handleLogout = () => {
    useUserStore.getState().setUser({
      name: '',
      email: '',
      phone: '',
      balance: '',
      brithday: '',
    })
    localStorage.removeItem('authToken');
    handleSettingsMenuClose();
    router.push('/')
  };

  return (
    <ThemeProvider theme={usedTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            <Tooltip title="主题色配置">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ ml: 2 }}
                aria-controls={menuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                <PaletteIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={menuOpen}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      usedTheme = lightTheme;
                    }}
                  >
                    默认
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      usedTheme = darkTheme;
                    }}
                  >
                    黑色
                  </Button>
                </Box>
              </MenuItem>
            </Menu>
            <Tooltip title="账户">
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="设置">
              <IconButton
                color="inherit"
                onClick={handleSettingsMenuOpen}
                aria-controls={settingsMenuOpen ? 'settings-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={settingsMenuOpen ? 'true' : undefined}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={settingsAnchorEl}
              id="settings-menu"
              open={settingsMenuOpen}
              onClose={handleSettingsMenuClose}
              onClick={handleSettingsMenuClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ChevronRightIcon fontSize="small" />
                </ListItemIcon>
                退出
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              菜单栏
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <Link href={item.path} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {children}
        </Main>
      </Box>
    </ThemeProvider>
  );
}