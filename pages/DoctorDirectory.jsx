import React, { useEffect, useState } from "react";
import DirectoryCard from "../components/DirectoryCard";
import { directorydata } from "../routes/data";
import { getDoc, SearchDoc, showMore } from "../routes/directory";
import styles from "../styles/Phonebook.module.css";
import styles1 from "../styles/Searchinput.module.css";

const DoctorDirectory = () => {
  const [docs, setdocs] = useState([]);
  const [showload, setshowload] = useState();
  const [full, setfull] = useState(false);
  const [input, setinput] = useState({
    val: "",
  });

  useEffect(() => {
    async function getalldoc() {
      const gotdata = await getDoc();
      console.log(gotdata);
      setdocs(gotdata.data);
      console.log(docs && docs, "All dOcs Data");
      // setload(false);
    }
    getalldoc();
  }, []);

  const ShowMoreDoc = async () => {
    setshowload(true);
    const data = await showMore();
    if (data.data.length == 0) {
      setfull(true);
    }
    setdocs(docs.concat(data.data));
    console.log(docs);
    setshowload(false);
  };

  const handleChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
    console.log(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.val == "") {
      const gotdata = await getDoc();

      return setdocs(gotdata.data);
    }
    const getdata = await SearchDoc(input.val);
    console.log(getdata);
    setdocs(getdata.data);
  };

  return (
    <>
      <div className={`${styles.directorypage}  p-5`}>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className={`${styles1.searchform}`}
          action="#"
        >
          <div className="relative">
            <input
              type="search"
              id="search"
              name="val"
              className={`${styles1.searchinput}`}
              placeholder="Search Doctor..."
              onChange={(e) => handleChange(e)}
            />
            <button
              onClick={(e) => handleSubmit(e)}
              type="button"
              className={`${styles1.searchbtn}`}
            >
              Search
            </button>
          </div>
        </form>

        <div className={`${styles.directoryshell}`}>
          {docs.length > 0 &&
            docs.map((item) => {
              return <DirectoryCard key={item._id} item={item && item} />;
            })}
        </div>
        <div className="pb-20 ">
          {full ? (
            <div
              // onClick={() => ShowMoreDoc()}
              className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
            >
              That's It
            </div>
          ) : (
            <div
              onClick={() => ShowMoreDoc()}
              className="m-auto p-2 border border-gray-700 w-[8rem] text-center mt-9 text-gray-800  font-bold cursor-pointer "
            >
              {showload ? "Loading..." : "Show More"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorDirectory;