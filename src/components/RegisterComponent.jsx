import React, { useState } from "react";
import { RegisterAPI } from "../api/AuthAPI";
import { postUserData } from "../api/FirestoreAPI";
import LinkedinLogo from "../assets/linkedinLogo.png";
import { useNavigate } from "react-router-dom";
import { getUniqueID } from "../helpers/getUniqueId";
import "../Sass/LoginComponent.scss";
import { toast } from "react-toastify";
import { Select } from "antd";
import { Skills } from "../consts/Skills";
import { engineeringColleges } from "../consts/Collages";

const userTypes = [
  { label: "Learner", value: "learner" },
  { label: "Freelancer", value: "freelancer" },
  { label: "Startup CEO", value: "startup_ceo" },
  { label: "Internship/Job Searcher", value: "internship_job_searcher" },
];

export default function RegisterComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const register = async () => {
    try {
      let res = await RegisterAPI(credentials.email, credentials.password);
      toast.success("Account Created!");
      const college = engineeringColleges.find(
        (college) => college.name === selectedCollege
      );
      postUserData({
        userID: getUniqueID(),
        name: credentials.name,
        email: credentials.email,
        imageLink:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
        skills: selectedSkills,
        college: selectedCollege,
        type: selectedType,
        latitude: college ? college.latitude : null,
        longitude: college ? college.longitude : null,
      });
      if (selectedType === "freelancer") {
        navigate("/freelancerhome");
      } else {
        navigate("/home");
      }
      localStorage.setItem("userEmail", res.user.email);
    } catch (err) {
      console.log(err);
      toast.error("Cannot Create your Account");
    }
  };

  return (
    <div className="login-wrapper">
      <h2 className="linkedinlogo">connect</h2>
      <div className="login-wrapper-inner">
        <h1 className="heading">Make the most of your professional life</h1>

        <div className="auth-inputs">
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, name: event.target.value })
            }
            type="text"
            className="common-input"
            placeholder="Your Name"
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
            type="email"
            className="common-input"
            placeholder="Email or phone number"
          />
          <input
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            type="password"
            className="common-input"
            placeholder="Password (6 or more characters)"
          />
          <Select
            mode="multiple"
            style={{ width: "100%", marginTop: "10px" }}
            placeholder="Select Skills"
            onChange={setSelectedSkills}
          >
            {Skills.map((skill) => (
              <Select.Option
                style={{ backgroundColor: "#0E1E2B", color: "#f1f4ff" }}
                key={skill.value || skill.label} // Fallback to `label` if `value` is null
                value={skill.value}
              >
                {skill.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: "100%", marginTop: "10px" }}
            placeholder="Select College"
            onChange={setSelectedCollege}
          >
            {engineeringColleges.map((college) => (
              <Select.Option key={college.name} value={college.name}>
                {college.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: "100%", marginTop: "10px" }}
            placeholder="Select Type"
            onChange={setSelectedType}
          >
            {userTypes.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </div>
        <button onClick={register} className="login-btn">
          Agree & Join
        </button>
      </div>
      <hr className="hr-text" data-content="or" />
      <div className="google-btn-container">
        <p className="go-to-signup">
          Already on Connect?{" "}
          <span className="join-now" onClick={() => navigate("/")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
