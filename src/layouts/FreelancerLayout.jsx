import React, { useMemo, useState } from "react";
import Home from "../Pages/Home";
import { getCurrentUser } from "../api/FirestoreAPI";
import FreelancerTop from "../components/common/FreelancerTop/FreelancerTop";
import FreelanceUsers from "../components/common/Freelancers";
const FreelancerLayout = () => {
  const [currentUser, setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div>
      <FreelancerTop currentUser={currentUser} />
      <FreelanceUsers currentUser={currentUser} />
    </div>
  );
};

export default FreelancerLayout;
