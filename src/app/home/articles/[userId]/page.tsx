'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  Snackbar,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// --- Types ---
// Assuming LoginUser model has at least userId and username
type AuthorDetails = {
  userId: number;
  username: string;
  // Add other relevant fields like avatarUrl if available
  avatar?: string; // Optional avatar URL
  email: string;
  money: string;
  birthday: Date;
};

// Matches the backend Article model (adjust if needed)
type Article = {
  articleId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string | Date; // Handle potential string/Date from API
  updatedAt: string | Date;
};

// Type for the article form (subset of Article)
type ArticleFormData = {
  title: string;
  content: string;
};

// --- Component ---
const AuthorArticlesPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId ? parseInt(params.userId as string, 10) : null;

  const [author, setAuthor] = useState<AuthorDetails | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleFormData, setArticleFormData] = useState<ArticleFormData>({ title: '', content: '' });

  // Delete confirmation dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // --- Data Fetching ---
  const fetchAuthorDetails = useCallback(async () => {
    if (!userId) {
      setError("Invalid User ID.");
      setLoadingAuthor(false);
      return;
    }
    setLoadingAuthor(true);
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }); // Use your actual user API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch author details (Status: ${response.status})`);
      }
      const data: AuthorDetails = await response.json();
      console.log("Fetched author details:", data);

      setAuthor({
        userId: data.userId,
        username: data.username,
        avatar: data.avatar,
        birthday: data.birthday,
        email: data.email,
        money: data.money
      })
      // setAuthor(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching author details:", err);
      setError(err.message || "Could not load author information.");
    } finally {
      setLoadingAuthor(false);
    }
  }, [userId]);

  const fetchArticles = useCallback(async () => {
    if (!userId) {
      // Error already set by fetchAuthorDetails or initial check
      setLoadingArticles(false);
      return;
    }
    setLoadingArticles(true);
    try {
      const response = await fetch(`http://localhost:8080/api/articles/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch articles (Status: ${response.status})`);
      }
      const data: Article[] = await response.json();
      // Ensure dates are Date objects if needed, or format them
      const formattedData = data.map(article => ({
        ...article,
        createdAt: article.createdAt ? new Date(article.createdAt).toLocaleString() : 'N/A',
        updatedAt: article.updatedAt ? new Date(article.updatedAt).toLocaleString() : 'N/A',
      }));
      setArticles(formattedData);
      setError(null); // Clear previous errors if articles fetch succeeds
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      setError(err.message || "Could not load articles.");
      setArticles([]); // Clear articles on error
    } finally {
      setLoadingArticles(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAuthorDetails();
    fetchArticles();
  }, [fetchAuthorDetails, fetchArticles]); // Rerun if userId changes (though unlikely on same page)

  // --- Snackbar Handler ---
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // --- Dialog Handlers ---
  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setSelectedArticle(null);
    setArticleFormData({ title: '', content: '' });
    setOpenAddEditDialog(true);
  };

  const handleOpenEditDialog = (article: Article) => {
    setIsEditing(true);
    setSelectedArticle(article);
    // Find the original article data to pre-fill content accurately if needed
    const originalArticle = articles.find(a => a.articleId === article.articleId);
    setArticleFormData({
      title: article.title,
      // Fetch full content if the table only shows a snippet
      content: originalArticle?.content || article.content || '' // Fallback
    });
    setOpenAddEditDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddEditDialog(false);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setArticleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveArticle = async () => {
    if (!userId) return; // Should not happen if button is enabled

    const url = isEditing ? `http://localhost:8080/api/articles/${selectedArticle?.articleId}` : 'http://localhost:8080/api/articles';
    const method = isEditing ? 'PUT' : 'POST';
    const bodyPayload = isEditing
      ? articleFormData // Send only updated fields for PUT
      : { ...articleFormData, userId: userId }; // Include userId for POST
    console.log("123123123");

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Get text first
        let errorMessage = `Failed to ${isEditing ? 'update' : 'add'} article`;
        try {
          const jsonData = JSON.parse(errorData); // Try parsing JSON
          errorMessage = jsonData.message || errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          errorMessage = errorData || errorMessage; // Use text if not JSON
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      // const savedArticle: Article = await response.json(); // Backend returns the saved/updated article

      showSnackbar(`Article successfully ${isEditing ? 'updated' : 'added'}!`, 'success');
      handleCloseAddEditDialog();
      fetchArticles(); // Refresh the articles list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} article:`, err);
      showSnackbar(err.message || `Could not ${isEditing ? 'update' : 'add'} article.`, 'error');
    }
  };

  // --- Delete Handlers ---
  const handleOpenDeleteDialog = (article: Article) => {
    setArticleToDelete(article);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setArticleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/articles/${articleToDelete.articleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to delete article (Status: ${response.status})`);
      }
      showSnackbar('Article successfully deleted!', 'success');
      handleCloseDeleteDialog();
      fetchArticles();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error deleting article:", err);
      showSnackbar(err.message || "Could not delete article.", 'error');
      handleCloseDeleteDialog();
    }
  };


  // --- DataGrid Columns ---
  const columns: GridColDef<Article>[] = [
    { field: 'articleId', headerName: '文章序号', width: 90 },
    { field: 'title', headerName: '标题', flex: 1, minWidth: 200 },
    // { field: 'content', headerName: 'Content', flex: 2, minWidth: 300 }, // Maybe too long for table
    { field: 'createdAt', headerName: '创建时间', width: 180 },
    { field: 'updatedAt', headerName: '更新时间', width: 180 },
    {
      field: 'actions',
      headerName: '操作',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<Article>) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // --- Render Logic ---
  if (loadingAuthor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !author) { // Critical error loading author
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
          Back
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/home/articles')} sx={{ mb: 2 }}>
      返回至作者列表
      </Button>

      {/* Author Info Header */}
      {author && (
        <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={`http://localhost:8080/avatars/${author.avatar}` || undefined} sx={{ width: 120, height: 120 }}>
            {/* Fallback to first letter if no avatar */}
            {!author.avatar && author.username ? author.username[0].toUpperCase() : null}
          </Avatar>
          <Box>
            <Typography variant="h5">{author.username}</Typography>
            <Typography variant="body2" color="text.secondary">用户序号: {author.userId}</Typography>
            {/* Corrected labels */}
            <Typography variant="body2" color="text.secondary">邮箱: {author.email}</Typography>
            <Typography variant="body2" color="text.secondary">余额: {author.money || 0}</Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Check if birthday exists and convert string to Date before formatting */}
              Birthday: {author.birthday ? new Date(author.birthday).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Add Article Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          disabled={!author} // Disable if author info failed to load
        >
        新增文章
        </Button>
      </Box>

      {/* Articles Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {author?.username}的文章
        </Typography>
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>} {/* Show non-critical errors here */}
        <Box sx={{ height: 500, width: '100%' }}>
          {loadingArticles ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={articles}
              columns={columns}
              getRowId={(row) => row.articleId}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
              }}
              pageSizeOptions={[5, 10, 25]}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
              disableRowSelectionOnClick
              autoHeight={false} // Use fixed height from Box
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
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEditDialog} onClose={handleCloseAddEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? '编辑文章' : '新增文章'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="文章标题"
            type="text"
            fullWidth
            variant="outlined"
            value={articleFormData.title}
            onChange={handleFormChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="content"
            label="文章内容"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={10}
            value={articleFormData.content}
            onChange={handleFormChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEditDialog}>取消</Button>
          <Button onClick={handleSaveArticle} variant="contained">
            {isEditing ? '保存更改' : '新增文章'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            {/* Are you sure you want to delete the article titled "{articleToDelete?.title}"? This action cannot be undone. */}
            确定要删除标题为 "{articleToDelete?.title}" 的文章吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>取消</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default AuthorArticlesPage;