import React, { useEffect } from "react";
import { getCookie } from "../../public/utils/Utils";
// import { getCookie } from "../utils/Utils";

const MyRequests = () => {
  useEffect(() => {
    async function getmyreq() {
      const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/mybloodreq`;
      console.log(inputdata);
      const token = await getCookie("usertoken");
      try {
        const UserData = JSON.parse(localStorage.getItem("labuser"));
        axios
          .post(
            url,
            { userID: UserData?.email },
            {
              headers: {
                "x-auth-token": token,
              },
            }
          )
          .then((data) => {
            console.log(data);
            if (data.data.id) {
              let forwardurl = `/Other/Bloodrecieve?reqid=${data.data.id}`;
              router.push(forwardurl);
              setrequestsent(true);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error, "Err");
      }
    }

    getmyreq();
  }, []);
  return <div>MyRequests</div>;
};

export default MyRequests;
