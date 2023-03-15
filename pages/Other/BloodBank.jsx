import React, { useEffect, useState } from "react";
import DirectoryCard from "../../components/DirectoryCard";
import { SearchDoc } from "../../routes/directory";

const BloodBank = () => {
  const [data, setdata] = useState();
  useEffect(() => {
    async function searchblood() {
      const key = "Blood Bank";
      const data = await SearchDoc(key);
      //   console.log(data, "Blood DAta");
      setdata(data && data.data);
    }
    searchblood();
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1
          style={{ fontSize: "1.3rem" }}
          className=" text-center mb-8 font-bold"
        >
          Related Information Regarding Blood Banks
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {data &&
            data.map((item) => {
              return <DirectoryCard key={item._id} item={item && item} />;
            })}
        </div>
      </div>
    </>
  );
};

export default BloodBank;
