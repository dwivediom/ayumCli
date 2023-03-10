import React, { useEffect, useState } from "react";
import { directorydata } from "../routes/data";
import { getDoc, SearchDoc } from "../routes/directory";
import styles from "../styles/Phonebook.module.css";
import styles1 from "../styles/Searchinput.module.css";

const DoctorDirectory = () => {
  const [docs, setdocs] = useState([]);
  const [load, setload] = useState();
  const [input, setinput] = useState({
    val: "",
  });
  useEffect(() => {
    async function getalldoc() {
      const gotdata = await getDoc();
      console.log(gotdata);
      setdocs(gotdata.data);
      console.log(docs && docs, "All dOcs Data");
      setload(false);
    }
    getalldoc();
  }, []);

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
  const getRandomColor = () => {
    // helper function to generate a random background color
    const colors = [
      "#e91e63",
      "rgb(166, 0, 255)",
      "#009698",
      "#ffc107",
      "rgb(43, 255, 0)",
      "rgb(15, 1, 215)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  return (
    <>
      <div className={`${styles.directorypage} pb-20 p-5`}>
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
              return (
                <div
                  style={{
                    borderTop: `4px solid ${getRandomColor()}`,
                  }}
                  key={item.name}
                  className={`${styles.directorycard}`}
                >
                  <div>
                    <div className={`${styles.cardname}`}> {item.name}</div>
                  </div>
                  <div className={`${styles.carddeatilbox}`}>
                    <div>
                      {" "}
                      <span className="font-bold">Time :</span> {item.timeing}
                    </div>
                    <div>
                      {" "}
                      <span className="font-bold">Phone :</span> {item.phone}
                    </div>
                  </div>
                  <div className={`${styles.carddeatilbox}`}>
                    <div>
                      {" "}
                      <span className="font-bold">City :</span> {item.city}
                    </div>
                    <div>
                      {" "}
                      <span className="font-bold">Specialist :</span>{" "}
                      {item.specialist}
                    </div>
                  </div>
                  <div className={`${styles.carddeatilbox}`}>
                    <div>
                      <span className="font-bold">Address :</span>{" "}
                      {item.address}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default DoctorDirectory;
