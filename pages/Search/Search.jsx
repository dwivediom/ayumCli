import React from "react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "../../styles/Searchinput.module.css";
import DoctorCard from "../../components/DoctorCard";
import Image from "next/image";

const Search = () => {
  const [data, setdata] = useState(null);
  const [input, setinput] = useState("");
  const sdata = useSelector((state) => state.quickSearchReducer);
  const [loading, setloading] = useState(false);
  const [reload, setreload] = useState(true);
  const [viewsearchill, setviewsearchill] = useState(true);
  const url = `${process.env.NEXT_PUBLIC_B_PORT}/api/search/${input}`;
  useEffect(() => {
    if (sdata.searchkey && reload) {
      setinput(sdata.searchkey);
      input && onloadSearch(input);
    }
  }, [sdata, reload, input]);

  const onloadSearch = async (input) => {
    const newurl = `${process.env.NEXT_PUBLIC_B_PORT}/api/search/${input}`;
    console.log(newurl);
    const searchdata = await axios.get(newurl);
    console.log(searchdata);
    setdata(searchdata);
    setreload(false);
  };

  const onSearch = async (e) => {
    if (input == "") {
      setdata(null);
      return setviewsearchill(true);
    }
    setviewsearchill(false);
    setloading(true);
    setreload(false);
    if (e) {
      e.preventDefault();
    }

    console.log(sdata);
    const searchdata = await axios.get(url);
    console.log(searchdata);
    setdata(searchdata);
    console.log(searchdata.data.length);
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
    <div className="m-4 ">
      <form className={`${styles.searchform}`} onSubmit={(e) => onSearch(e)}>
        <div className="relative">
          <input
            type="search"
            onChange={(e) => handleChange(e)}
            id="default-search"
            className={`${styles.searchinput}`}
            placeholder="Search Doctors, Specialist , Clinics..."
            required
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

      {viewsearchill && (
        <div
          style={{
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          <Image
            src={"/searchill.png"}
            width={170}
            height={170}
            alt="Loading..."
          />
        </div>
      )}

      {loading ? (
        <div
          style={{
            width: "100vw",
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          <Image src={"/loader.svg"} width={50} height={50} alt="Loading..." />
        </div>
      ) : (
        <div className="  m-auto mt-6 grid  lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-2 md:gap-4">
          {data && data.data.length == 0 ? (
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
            data &&
            data.data.map((doctor) => {
              return (
                <DoctorCard
                  key={doctor._id}
                  name={doctor.name}
                  specialist={doctor.specialist}
                  location={doctor.location}
                  phone={doctor.phone}
                  fees={doctor.fees}
                  timing={doctor.timing}
                  docid={doctor._id}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
