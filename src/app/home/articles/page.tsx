"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Button
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';

type Author = {
  id: number;
  name: string;
  articleCount: number;
};

const ArticlesManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  // 模拟获取作者数据
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      // 这里应该是实际的API调用
      // const response = await fetch(`/api/authors?page=${page}&limit=${rowsPerPage}`);
      // const data = await response.json();

      // 模拟数据
      setTimeout(() => {
        // 生成模拟数据
        const totalAuthors = 23; // 总作者数
        const mockAuthors = Array(Math.min(rowsPerPage, totalAuthors - (page - 1) * rowsPerPage))
          .fill(0)
          .map((_, index) => {
            const actualIndex = (page - 1) * rowsPerPage + index;
            return {
              id: actualIndex + 1,
              name: `作者${actualIndex + 1}`,
              articleCount: Math.floor(Math.random() * 20) + 1
            };
          });

        setAuthors(mockAuthors);
        setTotalPages(Math.ceil(totalAuthors / rowsPerPage));
        setLoading(false);
      }, 500);
    };

    fetchAuthors();
  }, [page]);

  // 准备MUI X Charts所需的数据格式
  const chartLabels = authors.map(author => author.name);
  const chartData = authors.map(author => author.articleCount);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box className="p-4">
      <Typography variant="h4" className="mb-6 text-center">
        文章管理
      </Typography>

      <Box className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
        {/* 左侧作者列表 */}
        <Paper className={`p-4 ${isMobile ? 'w-full' : 'w-1/2'}`}>
          <Typography variant="h6" className="mb-4">
            作者列表
          </Typography>

          {loading ? (
            <Box className="flex justify-center items-center h-64">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>作者名</TableCell>
                      <TableCell align="right">文章数</TableCell>
                      <TableCell align="center">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {authors.map((author) => (
                      <TableRow key={author.id}>
                        <TableCell>{author.id}</TableCell>
                        <TableCell>{author.name}</TableCell>
                        <TableCell align="right">{author.articleCount}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => alert(`编辑作者 ${author.name}`)}
                            >进入文章管理</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Paper>

        {/* 右侧统计图 */}
        <Paper className={`p-4 ${isMobile ? 'w-full' : 'w-1/2'}`}>
          <Typography variant="h6" className="mb-4">
            作者文章统计图
          </Typography>

          {loading ? (
            <Box className="flex justify-center items-center h-64">
              <CircularProgress />
            </Box>
          ) : (
            <Box className="h-80">
              {authors.length > 0 && (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: chartLabels }]}
                  series={[
                    {
                      data: chartData,
                      label: '文章数',
                      color: '#8884d8',
                    },
                  ]}
                  height={320}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ArticlesManagementPage;