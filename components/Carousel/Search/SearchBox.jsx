import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "../../../styles/Searchinput.module.css";
import { useRouter } from "next/router";
import { AccountContext } from "../../../context/AccountProvider";
import { getDoc, SearchDoc } from "../../../routes/directory";
import { debounce } from "lodash";

export default function SearchBox(props) {
  const router = useRouter();
  const { lang } = useContext(AccountContext);

  const clickserch = () => {
    router.push("/DoctorDirectory");
  };

  const [suggestion, setsuggestion] = useState([]);
  const [suggestionpopup, setsuggestionpopup] = useState(false);
  const [onpopup, setonpopup] = useState(false);
  const [docs, setdocs] = useState();
  const [input, setinput] = useState({
    val: "",
  });

  const debouncedOnChange = useCallback(
    debounce((val) => {
      handleSearch(val);
    }, 400), // 500ms delay
    []
  );

  const handleSearch = async (val) => {
    if (val != "" && val) {
      const getdata = await SearchDoc(val, 5);
      setsuggestion(getdata.data);
    }
  };
  useEffect(() => {
    console.log(props, "propsvalsearch");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input == "") {
      const gotdata = await getDoc();
      return props.setdoctordocs(gotdata);
    }
    setsuggestionpopup(false);
    const getdata = await SearchDoc(input);
    console.log(getdata, "setting");
    props.setdoctordocs(getdata);

    setdocs(getdata.data);
  };

  return (
    <div
      style={{
        maxWidth: "1240px",
        margin: "auto",
      }}
      className="px-4"
      // onClick={() => clickserch()}
    >
      <form
        onSubmit={(e) => handleSubmit(e)}
        className={`${styles.searchform}`}
        style={{ marginTop: "10px" }}
        action="#"
      >
        <div className="relative">
          <input
            type="search"
            id="search"
            name="val"
            className={`${styles.searchinput}`}
            placeholder="Search Doctor..."
            onChange={(e) => {
              debouncedOnChange(e.target.value);
              setinput(e.target.value);
              setsuggestionpopup(true);
            }}
            onFocus={() => {
              if (props.redirecttohome) {
                router.push("/DoctorDirectory");
                return;
              }
              setsuggestionpopup(true);
            }}
            onBlur={() => {
              if (onpopup) {
                setsuggestionpopup(false);
              }
            }}
          />
          {suggestionpopup && (
            <div
              onMouseEnter={() => {
                setsuggestionpopup(true);
                setonpopup(true);
              }}
              onMouseOut={() => {
                setonpopup(false);
              }}
              className={`${styles.suggestpopup}`}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginTop: "-5px",
                  marginBottom: "5px",
                  justifyContent: "right",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    padding: "0px 4px",
                    borderRadius: "24px",
                    border: "1px solid grey",
                  }}
                  onClick={() => {
                    setsuggestionpopup(false);
                  }}
                >
                  Close X
                </span>{" "}
              </div>
              {suggestion &&
                suggestion.length > 0 &&
                suggestion.map((item) => {
                  return (
                    <p
                      onClick={() => {
                        router.push(`/doctor?docid=${item._id}`);
                      }}
                      className={`${styles.suggestoption}`}
                    >
                      {item.name} , {item.city} , {item.specialist}
                    </p>
                  );
                })}
            </div>
          )}
          <button
            // onClick={(e) => handleSubmit(e)}
            type="submit"
            className={`${styles.searchbtn}`}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
