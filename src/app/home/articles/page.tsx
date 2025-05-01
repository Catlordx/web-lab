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
  Button,
  Alert // Import Alert for error display
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { useRouter } from "next/navigation";

// Updated Author type to match backend DTO
type Author = {
  userId: number; // Changed from id to userId
  name: string;
  articleCount: number;
};

// Type for the backend response structure
type PaginatedAuthorsResponse = {
  content: Author[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
};

const ArticlesManagementPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5; // Should match the default limit in backend or be passed

  // Fetch real author data from the backend
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching
      try {
        // Adjust the URL to your actual backend endpoint if different
        console.log(localStorage.getItem('token'));

        const response = await fetch(`http://localhost:8080/api/authors?page=${page}&limit=${rowsPerPage}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );

        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PaginatedAuthorsResponse = await response.json();

        setAuthors(data.content);
        setTotalPages(data.totalPages);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to fetch authors:", err);
        setError(err.message || "Failed to load author data."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [page, rowsPerPage]); // Add rowsPerPage as dependency if it can change

  // Prepare MUI X Charts data (no change needed here)
  const chartLabels = authors.map(author => author.name);
  const chartData = authors.map(author => author.articleCount);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Function to handle navigation to user's articles (implement actual navigation)
  const handleManageArticles = (userId: number, authorName: string) => {
    // Replace alert with actual navigation logic, e.g., using Next.js router
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    // router.push(`/home/articles/${userId}`);
    // alert(`Navigate to manage articles for ${authorName} (User ID: ${userId})`);
    console.log(`Navigating to manage articles for ${authorName} (User ID: ${userId})`);
    router.push(`/home/articles/${userId}`); // Navigate to the dynamic route

  };


  return (
    <Box className="p-4">
      <Typography variant="h4" className="mb-6 text-center">
        文章管理 - 作者概览
      </Typography>

      {/* Display Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
        {/* Left side: Author List */}
        <Paper className={`p-4 ${isMobile ? 'w-full' : 'w-1/2'}`}>
          <Typography variant="h6" className="mb-4">
            作者列表
          </Typography>

          {loading ? (
            <Box className="flex justify-center items-center h-64">
              <CircularProgress />
            </Box>
          ) : !error && authors.length > 0 ? ( // Only show table if no error and data exists
            <>
              <TableContainer>
                <Table size="small"><TableHead>
                  <TableRow>
                    <TableCell>用户ID</TableCell>
                    <TableCell>作者名</TableCell>
                    <TableCell align="right">文章数</TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead><TableBody>
                    {authors.map((author) => (
                      // Use userId for the key
                      <TableRow key={author.userId} hover>
                        <TableCell>{author.userId}</TableCell>
                        <TableCell>{author.name}</TableCell>
                        <TableCell align="right">{author.articleCount}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined" // Changed variant for less emphasis
                            size="small"
                            color="primary"
                            onClick={() => handleManageArticles(author.userId, author.name)}
                          >
                            管理文章
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody></Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="flex justify-center mt-4">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : !error ? ( // No error, but no authors
            <Typography sx={{ textAlign: 'center', mt: 4 }}>暂无作者数据。</Typography>
          ) : null /* Error is already displayed above */}
        </Paper>

        {/* Right side: Statistics Chart */}
        <Paper className={`p-4 ${isMobile ? 'w-full' : 'w-1/2'}`}>
          <Typography variant="h6" className="mb-4">
            作者文章统计图
          </Typography>

          {loading ? (
            <Box className="flex justify-center items-center h-64">
              <CircularProgress />
            </Box>
          ) : !error && authors.length > 0 ? ( // Only show chart if no error and data exists
            <Box sx={{ height: 320 }}> {/* Ensure Box has height */}
              <BarChart
                xAxis={[{ scaleType: 'band', data: chartLabels, tickLabelStyle: { angle: -30, textAnchor: 'end', fontSize: 10 } }]} // Rotate labels if needed
                series={[
                  {
                    data: chartData,
                    label: '文章数',
                    // color: '#8884d8', // You can customize color
                  },
                ]}
                height={320} // Match Box height
                margin={{ top: 20, bottom: 50, left: 40, right: 10 }} // Adjust margins
              // Optional: Add tooltips or other features
              // tooltip={{ trigger: 'item' }}
              />
            </Box>
          ) : !error ? ( // No error, but no data for chart
            <Typography sx={{ textAlign: 'center', mt: 4 }}>无数据可供统计。</Typography>
          ) : null /* Error is already displayed above */}
        </Paper>
      </Box>
    </Box>
  );
};

export default ArticlesManagementPage;