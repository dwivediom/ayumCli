import React, { useEffect, useState, useContext } from "react";
import User from "./User";
import styles from "../../styles/chat.module.css";

const Search = ({ mobile, searcheddata, admin }) => {
  console.log(searcheddata, "search data");
  return (
    <>
      <div className=" h-full w-full  rounded-lg shadow">
        <div className={`${styles.usercontainer}`}>
          {searcheddata &&
            searcheddata.data.map((user) => {
              if (user.sub != admin.sub) {
                return (
                  <User
                    mobile={mobile}
                    key={user.email}
                    name={user.name}
                    user={user}
                  />
                );
              }
            })}
        </div>
      </div>
    </>
  );
};

export default Search;
