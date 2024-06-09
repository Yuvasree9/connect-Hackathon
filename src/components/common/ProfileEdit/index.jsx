import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { editProfile } from "../../../api/FirestoreAPI";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa"; // Importing social media icons
import "./index.scss";

export default function ProfileEdit({ onEdit, currentUser }) {
  const [editInputs, setEditInputs] = useState(currentUser);

  const getInput = (event) => {
    const { name, value } = event.target;
    setEditInputs({ ...editInputs, [name]: value });
  };

  const updateProfileData = async () => {
    await editProfile(currentUser?.id, editInputs);
    await onEdit();
  };

  return (
    <div className="profile-card">
      <div className="edit-btn">
        <AiOutlineClose className="close-icon" onClick={onEdit} size={25} />
      </div>

      <div className="profile-edit-inputs">
        <label>Name</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Name"
          name="name"
          value={editInputs.name}
        />
        <label>Headline</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Headline"
          value={editInputs.headline}
          name="headline"
        />
        <label>Country</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Country"
          name="country"
          value={editInputs.country}
        />
        <label>City</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="City"
          name="city"
          value={editInputs.city}
        />
        <label>Company</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Company"
          value={editInputs.company}
          name="company"
        />
        <label>Industry </label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Industry"
          name="industry"
          value={editInputs.industry}
        />
        <label>College</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="College"
          name="college"
          value={editInputs.college}
        />
        <label>Website</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Website"
          name="website"
          value={editInputs.website}
        />
        <label>About</label>
        <textarea
          placeholder="About Me"
          className="common-textArea"
          onChange={getInput}
          rows={5}
          name="aboutMe"
          value={editInputs.aboutMe}
        />
        <label>Skills</label>
        <input
          onChange={getInput}
          className="common-input"
          placeholder="Skill"
          name="skills"
          value={editInputs.skills}
        />

        {/* Social media input fields */}
        <label>LinkedIn</label>
        <div className="social-input">
          <FaLinkedin className="social-icon" size={20} />
          <input
            onChange={getInput}
            className="common-input"
            placeholder="LinkedIn"
            name="linkedin"
            value={editInputs.linkedin || ""}
          />
        </div>

        <label>Instagram</label>
        <div className="social-input">
          <FaInstagram className="social-icon" size={20} />
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Instagram"
            name="instagram"
            value={editInputs.instagram || ""}
          />
        </div>

        <label>Email</label>
        <div className="social-input">
          <FaEnvelope className="social-icon" size={20} />
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Email"
            name="email"
            value={editInputs.email || ""}
          />
        </div>
        {/* Add more social media input fields as needed */}

      </div>
      <div className="save-container">
        <button className="save-btn" onClick={updateProfileData}>
          Save
        </button>
      </div>
    </div>
  );
}
