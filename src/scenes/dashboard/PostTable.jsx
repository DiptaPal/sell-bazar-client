import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
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
  MenuItem,
  Modal,
  Typography,
  Fade,
  Backdrop,
  InputBase,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import UserImage from "components/UserImage";
import { format, set } from "date-fns";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import {
  AttachFileOutlined,
  DeleteOutlined,
  EditOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import { setPosts } from "state";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PostTable = () => {
  const token = useSelector((state) => state.token);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editPost, setEditPost] = useState(null);

  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handleEdit = (post) => {
    setImage(post.picturePath ? post.picturePath : null)
    setEditPost(post);
    setPost(post.description);
    setPrice(post.price);
    setCategory(post.category);
    handleOpen();
  };

  const {
    data: posts = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/posts/dashboard`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    },
  });

  const handleUpdateLevel = (level, postId) => {
    fetch(`http://localhost:3001/posts/${postId}/level`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ level }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(`Post updated with id ${postId}`);
        refetch();
        alert(`Post updated successfully`);
      })
      .catch((error) => {
        console.error("Error updating post:", error.message);
      });
  };

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
        // console.log(`Post deleted with id ${postId}`);
        refetch();
        alert(`Post delete successfully`);
      })
      .catch((error) => {
        console.error("Error deleting post:", error.message);
      });
  };

  const handleUpdatePost = async () => {
    const formData = new FormData();
    formData.append("postId", editPost?._id);
    formData.append("description", post);
    formData.append("price", parseFloat(price));
    formData.append("category", category.toLocaleLowerCase());
    if (image?.name) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    else{
      formData.append("picturePath", editPost?.picturePath || null);
    }

    const response = await fetch(`http://localhost:3001/posts/${editPost?._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    handleClose();
    refetch();
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
            <TableCell align="center">Set Level</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow key={post._id}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <UserImage image={post?.picturePath} />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box
                    // width full
                    width={200}
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
                {format(new Date(post.createdAt), "dd-MM-yyyy")}
              </TableCell>
              <TableCell align="center">{post.category}</TableCell>
              <TableCell align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={3}
                >
                  {post.level}
                  <TextField
                    select
                    variant="outlined"
                    value={post.level} // Set your default value here
                    width="100%"
                    onChange={(e) =>
                      handleUpdateLevel(e.target.value, post._id)
                    }
                  >
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" gap="5px" justifyContent="center">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(post._id)}
                    m={1}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <WidgetWrapper>
              <FlexBetween
                gap="1.5rem"
                flexDirection={!isNonMobileScreens ? "column" : "row"}
              >
                <InputBase
                  placeholder="Description of your product"
                  onChange={(e) => setPost(e.target.value)}
                  defaultValue={editPost?.description}
                  name="description"
                  required
                  sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "1rem 2rem",
                  }}
                />
                <InputBase
                  placeholder="Price of your product"
                  onChange={(e) => setPrice(e.target.value)}
                  defaultValue={editPost?.price}
                  name="price"
                  required
                  sx={{
                    width: "100%",
                    backgroundColor: palette.neutral.light,
                    borderRadius: "2rem",
                    padding: "1rem 2rem",
                  }}
                />
                <TextField
                  select
                  label="Select a category"
                  defaultValue={editPost?.category}
                  name="category"
                  required
                  onChange={(e) => setCategory(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{
                    marginTop: isNonMobileScreens ? 0 : "1rem",
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  <MenuItem value="electronics bazaar">
                    Electronics Bazaar
                  </MenuItem>
                  <MenuItem value="fashion bazaar">Fashion Bazaar</MenuItem>
                  <MenuItem value="home & living marketplace">
                    Home & Living Marketplace
                  </MenuItem>
                  <MenuItem value="beauty & wellness bazaar">
                    Beauty & Wellness Bazaar
                  </MenuItem>
                  <MenuItem value="books & stationery corner">
                    Books & Stationery Corner
                  </MenuItem>
                  <MenuItem value="sports & outdoor emporium">
                    Sports & Outdoor Emporium
                  </MenuItem>
                  <MenuItem value="toys & games haven">
                    Toys & Games Haven
                  </MenuItem>
                  <MenuItem value="art & craft bazaar">
                    Art & Craft Bazaar
                  </MenuItem>
                  <MenuItem value="jewelry junction">Jewelry Junction</MenuItem>
                </TextField>
              </FlexBetween>
              {isImage && (
                <Box
                  border={`1px solid ${medium}`}
                  borderRadius="5px"
                  mt="1rem"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <FlexBetween>
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          width="100%"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!editPost?.picturePath && !image ? (
                            <p>Add Image Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{image?.name || editPost?.picturePath}</Typography>
                              <EditOutlined />
                            </FlexBetween>
                          )}
                        </Box>
                        {image && (
                          <IconButton
                            onClick={() => setImage(null)}
                            sx={{ width: "15%" }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        )}
                      </FlexBetween>
                    )}
                  </Dropzone>
                </Box>
              )}

              <Divider sx={{ margin: "1.25rem 0" }} />

              <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                  <ImageOutlined sx={{ color: mediumMain }} />
                  <Typography
                    color={mediumMain}
                    sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                  >
                    Image
                  </Typography>
                </FlexBetween>

                {isNonMobileScreens ? (
                  <>
                    <FlexBetween gap="0.25rem">
                      <GifBoxOutlined sx={{ color: mediumMain }} />
                      <Typography color={mediumMain}>Clip</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.25rem">
                      <AttachFileOutlined sx={{ color: mediumMain }} />
                      <Typography color={mediumMain}>Attachment</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.25rem">
                      <MicOutlined sx={{ color: mediumMain }} />
                      <Typography color={mediumMain}>Audio</Typography>
                    </FlexBetween>
                  </>
                ) : (
                  <FlexBetween gap="0.25rem">
                    <MoreHorizOutlined sx={{ color: mediumMain }} />
                  </FlexBetween>
                )}

                <Button
                 onClick={handleClose}
                  sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdatePost}
                  sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                  }}
                >
                  Update
                </Button>
              </FlexBetween>
            </WidgetWrapper>
          </Box>
        </Fade>
      </Modal>
    </TableContainer>
  );
};

export default PostTable;
