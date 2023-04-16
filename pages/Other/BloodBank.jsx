import Image from "next/image";
import React, { useEffect, useState } from "react";
import DirectoryCard from "../../components/DirectoryCard";
import { SearchDoc } from "../../routes/directory";
import styles from "../../styles/BloodPage.module.css";

const BloodBank = () => {
  const [data, setdata] = useState();
  const [loading, setloading] = useState(false);
  useEffect(() => {
    async function searchblood() {
      setloading(true);
      const key = "Blood Bank";
      const data = await SearchDoc(key);
      setdata(data && data.data);
      setloading(false);
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
        <div className={styles.bloodheadback}></div>

        <h1
          style={{
            fontSize: "1.3rem",
            boxShadow: "2px 2px 15px rgba(0,0,0,0.3)",
          }}
          className=" text-center mb-8 font-bold text-white bg-red-600 p-4 rounded-md"
        >
          Blood Banks Related Information
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "2rem",

            height: "16rem",
            overflow: "auto",
            flexWrap: "wrap",
          }}
        >
          {loading ? (
            <div
              style={{
                width: "100vw",
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={"/loader.svg"}
                width={20}
                height={20}
                alt="Loading..."
              />
            </div>
          ) : (
            data &&
            data.map((item) => {
              return <DirectoryCard key={item._id} item={item && item} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default BloodBank;
