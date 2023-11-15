import { Box } from "@mui/material";
import defaultImage from "../assets/default_large.png";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={(image !== "null" && image !== undefined) ? `http://localhost:3001/assets/${image}` : defaultImage}
      />
    </Box>
  );
};

export default UserImage;
