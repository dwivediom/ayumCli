import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../context/AccountProvider";

const SendPrivatebtn = () => {
  const {
    msgprivate,
    setmsgprivate,
    account,
    person,
    setmsgchange,
    setAccount,
  } = useContext(AccountContext);
  const [togglevalue, settogglevalue] = useState(false);
  const [ischecked, setischecked] = useState(false);
  const [text, settext] = useState(
    ` private messaging  is on .. welcome to security  .. the moment you go offline all the private message are deleted `
  );

  var notifiymsg = {
    senderId: JSON.parse(localStorage.getItem("labuser")).sub,
    reciverId: person.user.sub,
    text: text,
    type: "text",
  };

  const togglehandle = async (e) => {
    setmsgprivate(e.target.checked);
    if (e.target.checked == true) {
      setmsgchange(notifiymsg);
    }

    console.log(e.target.checked);
  };

  return (
    <>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          onChange={(e) => togglehandle(e)}
          class="sr-only peer"
        />
        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Private{" "}
        </span>
      </label>
    </>
  );
};

export default SendPrivatebtn;
