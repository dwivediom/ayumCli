import React from "react";
import UserProfile from "../components/UserProfile";

const Profile = (props) => {
  return (
    <div>
      <UserProfile {...props} />
    </div>
  );
};

export default Profile;
