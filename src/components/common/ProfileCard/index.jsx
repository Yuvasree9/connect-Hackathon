import React, { useState, useMemo } from "react";
import { getSingleStatus, getSingleUser } from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { HiOutlinePencil } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa"; // Importing social media icons
import "./index.scss";

export default function ProfileCard({ onEdit, currentUser }) {
  const location = useLocation();
  const [allStatuses, setAllStatus] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});
  const [currentImage, setCurrentImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const getImage = (event) => {
    setCurrentImage(event.target.files[0]);
  };

  const uploadImage = () => {
    if (currentImage) {
      uploadImageAPI(
        currentImage,
        currentUser.id,
        setModalOpen,
        setProgress,
        setCurrentImage
      );
    }
  };

  useMemo(() => {
    if (location?.state?.id) {
      getSingleStatus(setAllStatus, location.state.id);
    }

    if (location?.state?.email) {
      getSingleUser(setCurrentProfile, location.state.email);
    }
  }, [location?.state?.id, location?.state?.email]);

  // Ensure currentUser and location.state are defined before rendering
  if (!currentUser || !location.state) {
    return <div>Loading...</div>; // or any loading indicator
  }

  const profileImage = currentProfile?.imageLink || currentUser.imageLink;
  const profileName = currentProfile?.name || currentUser.name;
  const profileHeadline = currentProfile?.headline || currentUser.headline;
  const profileLocation = (currentProfile?.city && currentProfile?.country)
    ? `${currentProfile.city}, ${currentProfile.country}`
    : (currentUser.city && currentUser.country)
    ? `${currentUser.city}, ${currentUser.country}`
    : '';
  const profileWebsite = currentProfile?.website || currentUser.website;
  const profileCollege = currentProfile?.college || currentUser.college;
  const profileCompany = currentProfile?.company || currentUser.company;
  const profileAboutMe = currentProfile?.aboutMe || currentUser.aboutMe;
  const profileSkills = currentProfile?.skills || currentUser.skills;

  return (
    <>
      {/* <FileUploadModal
        getImage={getImage}
        uploadImage={uploadImage}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        currentImage={currentImage}
        progress={progress}
      /> */}
      <div className="profile-card">
        {currentUser.id === location.state.id && (
          <div className="edit-btn">
            <HiOutlinePencil className="edit-icon" onClick={onEdit} />
          </div>
        )}
        <div className="profile-info">
          <div>
            <img
              className="profile-image"
              onClick={() => setModalOpen(true)}
              src={profileImage}
              alt="profile-image"
            />
            <h3 className="userName">{profileName}</h3>
            <p className="heading">{profileHeadline}</p>
            {profileLocation && (
              <p className="location">{profileLocation}</p>
            )}
            {profileWebsite && (
              <a className="website" target="_blank" href={profileWebsite}>
                {profileWebsite}
              </a>
            )}

            {/* Social media icons */}
            {currentProfile?.linkedin && (
              <a
                href={currentProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="social-icon" size={20} />
              </a>
            )}
            {currentProfile?.instagram && (
              <a
                href={currentProfile.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="social-icon" size={20} />
              </a>
            )}
            {currentProfile?.email && (
              <a href={`mailto:${currentProfile.email}`}>
                <FaEnvelope className="social-icon" size={20} />
              </a>
            )}
          </div>

          <div className="right-info">
            <p className="college">{profileCollege}</p>
            <p className="company">{profileCompany}</p>
          </div>
        </div>
        <p className="about-me">{profileAboutMe}</p>
        {profileSkills && (
          <p className="skills">
            <span className="skill-label">Skills</span>: {profileSkills}
          </p>
        )}
      </div>

      <div className="post-status-main">
        {allStatuses.map((posts) => (
          <div key={posts.id}>
            <PostsCard posts={posts} />
          </div>
        ))}
      </div>
    </>
  );
}
