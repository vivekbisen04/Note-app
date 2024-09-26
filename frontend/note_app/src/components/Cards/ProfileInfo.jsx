import React from 'react'
import { useNavigate } from "react-router-dom";

const ProfileInfo = ({userInfo,userName}) => {
  const navigate = useNavigate();



  function getInitials(fullName) {
    const nameParts = fullName.trim().split(" ");
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || "";
    const lastInitial =
      nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  }


  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userName)}
         
      </div>
      <p
        className="text-sm font-medium
      "
      >
        {userName}
       
      </p>
      <button
        className="text-sm text-slate-700 underline"
        onClick={() => {
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileInfo