import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useEffect, useState } from "react";
import UserTable from "scenes/dashboard/UserTable";
import PostTable from "./PostTable";

const Dashboard = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = useSelector((state) => state.token);
  const userPost = useSelector((state) => state.userPost);

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    const response = await fetch(`http://localhost:3001/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "20%" : undefined}>
          <UserWidget
            userId={_id}
            picturePath={picturePath}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "78%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {userPost === "user" ? <UserTable /> : <PostTable />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
