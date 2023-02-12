import { useRouter } from "next/router";
import React from "react";
import SelectClinicComp from "../../components/UserProfile/SelectClinicComp";

const SelectClinic = () => {
  const router = useRouter();
  const { did } = router.query;
  return <SelectClinicComp docid={did && did} />;
};

export default SelectClinic;
