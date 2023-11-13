import React from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
} from "@mui/material";
import UserImage from "components/UserImage";
import { format } from "date-fns";

const PostTable = () => {
  const token = useSelector((state) => state.token);
  const {
    data: posts = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    },
  });

  const handleDelete = (postId) => {
    fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Post deleted with id ${postId}`);
        refetch();
      })
      .catch((error) => {
        console.error("Error deleting post:", error.message);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">No</TableCell>
            <TableCell align="center">Photo</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Post By</TableCell>
            <TableCell align="center">Post At</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow key={post._id}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <UserImage image={post.userPicturePath} />
                </Box>
              </TableCell>
              <TableCell>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box
                    // width full
                    width={300}
                    height={80}
                    px={1}
                    sx={{
                      bgcolor: "text.secondary",
                      color: "black",
                      borderRadius: 1,
                    }}
                    style={{ overflowX: "auto" }}
                  >
                    {post.description}
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="center">{`${post.firstName} ${post.lastName}`}</TableCell>
              <TableCell align="center">
              {format(new Date(post.createdAt), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell align="center">{post.category}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostTable;
