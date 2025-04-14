'use client'
import { Box, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Image from 'next/image';
import useUserStore from '@/store/userStore';
const HomePage = () => {
  const { user } = useUserStore();

  return (
    <Container >
      <Box height={150} />
      <Grid container spacing={5}>
        <Grid size={6}>
          <center>
            <Paper elevation={3} sx={{ width: 300, height: 300, borderRadius: 10 }}>
              <Image src={"/profile_picture.png"} alt="Vercel" width={300} height={300} />
            </Paper>
          </center>
        </Grid>
        <Grid size={6}>
          <Container >
            <center>
              <Typography variant='h5'>
                用户基本信息
              </Typography>
            </center>
            <div className='flex flex-col w-full space-y-2'>
              {selfInfoCell("用户名", user.username)}
              {selfInfoCell("邮箱", user.email)}
              {selfInfoCell("手机号", user.phone)}
              {selfInfoCell("地址", user.address)}
            </div>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
}

const selfInfoCell = (title: string, content: string) => {

  return (
    <div className='w-full flex flex-row'>
      <div className='w-1/5 bg-gray-200 rounded-l-lg  text-center px-2'>
        {title}
      </div>
      <div className='w-4/5'>
        {content}
      </div>
    </div>
  )
}
export default HomePage;
