import React from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "../../styles/Searchinput.module.css";
import styles2 from "../../styles/doctorcard.module.css";
import DoctorCard from "../../components/DoctorCard";
import Image from "next/image";
import { setDocDataAction } from "../../redux/actions/userActions";
import { SearchDoc } from "../../routes/directory";
import DirectoryCard from "../../components/DirectoryCard";

import Slider2 from "../../components/AdComp3";

const Search = () => {
  const [data, setdata] = useState(null);
  const [docs, setdocs] = useState(null);

  const [input, setinput] = useState("");
  const sdata = useSelector((state) => state.quickSearchReducer);
  const [loading, setloading] = useState(false);
  const [reload, setreload] = useState(true);
  const [viewsearchill, setviewsearchill] = useState(true);
  const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/search/${input}`;
  useEffect(() => {
    console.log("sedata", sdata);

    onSearch();
    if (localStorage.skey && reload) {
      setinput(localStorage.skey);
      input && onloadSearch(input);
    }
  }, [sdata, reload, input]);

  const onloadSearch = async (input) => {
    setloading(true);
    const newurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/search/${input}`;
    console.log(newurl);
    const searchdata = await axios.get(newurl);
    setdata(searchdata);
    const getdata = await SearchDoc(input);
    setdocs(getdata.data);
    setloading(false);
    setreload(false);
    if (searchdata.data) {
      setviewsearchill(false);
    }
    localStorage.removeItem("skey");
  };

  const onSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (input == "") {
      setviewsearchill(false);
      setloading(true);
      setreload(false);
      const getdata = await SearchDoc("D");
      setdocs(getdata.data);
      setloading(false);
      return;
    }
    setviewsearchill(false);
    setloading(true);
    setreload(false);
    if (e) {
      e.preventDefault();
    }

    console.log(sdata);
    const searchdata = await axios.get(url);

    const getdata = await SearchDoc(input);
    setdocs(getdata.data);
    setdata(searchdata);
    setloading(false);
  };
  {
    data && console.log(data.data);
  }

  const handleChange = (e) => {
    let val = e.target.value;
    setinput(val);
  };

  return (
    <>
      <div className="p-4 absolute w-[98vw] overflow-hidden pb-[8rem]">
        <form className={`${styles.searchform}`} onSubmit={(e) => onSearch(e)}>
          <div className="relative">
            <input
              type="search"
              onChange={(e) => handleChange(e)}
              id="default-search"
              className={`${styles.searchinput}`}
              placeholder="Search Doctors, Specialist , Clinics..."
            />
            <button
              type="button"
              onClick={(e) => onSearch(e)}
              className={`${styles.searchbtn}`}
            >
              Search
            </button>
          </div>
        </form>

        <Slider2 />

        {loading ? (
          <div
            style={{
              width: "100vw",
              height: "50vh",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              margin: "auto",
              marginTop: "1rem",
            }}
          >
            <Image
              src={"/loader.svg"}
              width={30}
              height={30}
              alt="Loading..."
            />
          </div>
        ) : (
          <div className={`${styles2.doccontainer} `}>
            {data && data.data.length == 0 && docs && docs.length == 0 ? (
              <div
                style={{
                  height: "50vh",
                  width: "90vw",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <Image
                  src={"/notfound.png"}
                  width={170}
                  height={140}
                  alt="Loading..."
                />
              </div>
            ) : (
              <>
                <div className={`${styles2.doccontainer} `}>
                  {data &&
                    data.data.map((doctor) => {
                      console.log(
                        doctor.picture,
                        doctor,
                        "Doctor Ka Searchdata"
                      );
                      return (
                        <DoctorCard
                          key={doctor._id}
                          pic={doctor.picture}
                          name={doctor.name}
                          specialist={doctor.specialist}
                          location={doctor.location}
                          phone={doctor.phone}
                          fees={doctor.fees}
                          timing={doctor.timing}
                          docid={doctor._id}
                        />
                      );
                    })}
                </div>
                <div className="shadow-lg p-1 w-full text-center font-bold rounded-lg">
                  {"Search Doctor's information "}
                </div>
                <div className={`${styles2.directoryshell} `}>
                  {docs &&
                    docs.map((item) => {
                      return (
                        <DirectoryCard key={item._id} item={item && item} />
                      );
                    })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
