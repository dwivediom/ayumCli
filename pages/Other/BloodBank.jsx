import Image from "next/image";
import React, { useEffect, useState } from "react";
import DirectoryCard from "../../components/DirectoryCard";
import { SearchDoc } from "../../routes/directory";
import styles from "../../styles/BloodPage.module.css";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";

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

  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    setscrollbox(false);
  }, []);
  return (
    <>
      <div
        className=" w-full m-auto mt-[-1rem] absolute overflow-scroll"
        id="bloodpage"
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",

          flexDirection: "column",
        }}
      >
        <div style={{ zIndex: "-10" }} className={styles.bloodheadback}></div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "2rem",

            // height: "16rem",
            paddingBottom: "2rem",
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
