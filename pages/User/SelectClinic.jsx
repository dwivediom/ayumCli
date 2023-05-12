import { useRouter } from "next/router";
import React from "react";
import SelectClinicComp from "../../components/UserProfile/SelectClinicComp";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import { useEffect } from "react";

const SelectClinic = () => {
  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    setscrollbox(false);
  }, []);
  const router = useRouter();
  const { did } = router.query;
  return <SelectClinicComp docid={did && did} />;
};

export default SelectClinic;
