import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
} from "@mui/material";
import UserImage from "components/UserImage";
import { useQuery} from "react-query";
import { useSelector } from "react-redux";

const UserTable = () => {
  const token = useSelector((state) => state.token);
  const {
    data: users = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    },
  });

  const handleRatingChange = (userId, newRating) => {
    // Assuming 'token' is defined somewhere in your code

    fetch(`http://localhost:3001/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: newRating }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`Rating changed for user ${userId} to ${newRating}`);
        // Assuming refetch is defined somewhere in your code
        refetch();
      })
      .catch((error) => {
        console.error("Error updating rating:", error.message);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">User Profile</TableCell>
            <TableCell align="center">User Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Occupation</TableCell>
            <TableCell align="center">Set Rating</TableCell>
            <TableCell align="center">Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <UserImage image={user.picturePath} />
                </Box>
              </TableCell>
              <TableCell align="center">{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell align="center">{user.email}</TableCell>
              <TableCell align="center">{user.occupation}</TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Rating
                    name={`rating-${user.id}`}
                    value={parseInt(user.rating)}
                    onChange={(event, newRating) =>
                      handleRatingChange(user._id, newRating)
                    }
                  />
                </Box>
              </TableCell>
              <TableCell align="center">{user.rating || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
