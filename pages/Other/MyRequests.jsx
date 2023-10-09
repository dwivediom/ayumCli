import React, { useEffect } from "react";

const MyRequests = () => {
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/mybloodreq`;
    console.log(inputdata);
    try {
      const UserData = JSON.parse(localStorage.getItem("labuser"));
      axios
        .post(
          url,
          { userID: UserData?.email },
          {
            headers: {
              "x-auth-token": localStorage.usertoken,
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
  }, []);
  return <div>MyRequests</div>;
};

export default MyRequests;
