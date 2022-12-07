import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
const Doctor = dynamic(() => import("./Doctor"));
import Image from "next/image";

const GetDoctor = ({ getDoctor }) => {
  return (
    <>
      <div className="  md:grid m-auto  overflow-hidden md:grid-cols-2  lg:grid-cols-4  gap-3">
        {getDoctor
          .slice(0)
          .reverse()
          .map((doctor) => {
            return (
              <Doctor
                key={doctor._id}
                name={doctor.doctor.name}
                specialist={doctor.specialist}
                location={doctor.location}
                phone={doctor.doctor.phone}
                fees={doctor.fees}
                timing={doctor.timing}
                docid={doctor.doctor._id}
              />
            );
          })}
      </div>
    </>
  );
};

export default React.memo(GetDoctor);
