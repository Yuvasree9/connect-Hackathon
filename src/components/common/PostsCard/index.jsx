import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
  getCurrentUser,
  getAllUsers,
  deletePost,
  getConnections,
  getCollaborationRequests,
  updateCollaborationStatus,
} from "../../../api/FirestoreAPI";
import LikeButton from "../LikeButton";
import Ally from "./Ally";
import "./index.scss";

// Function to remove HTML tags from a string
const stripHtmlTags = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export default function PostsCard({ posts, id, getEditData }) {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [requests, setRequests] = useState([]);

  useMemo(() => {
    getCurrentUser(setCurrentUser);
    getAllUsers(setAllUsers);
  }, []);

  useEffect(() => {
    if (currentUser?.id && posts?.userID) {
      getConnections(currentUser.id, posts.userID, setIsConnected);
    }
    if (currentUser?.id) {
      getCollaborationRequests(currentUser.id, setRequests);
    }
  }, [currentUser?.id, posts?.userID]);

  const handleUpdateRequestStatus = (requestId, status) => {
    updateCollaborationStatus(requestId, status);
  };

  // Ensure currentUser and posts are defined before rendering
  if (!currentUser || !posts) {
    return null;
  }

  const user = allUsers.find((user) => user.id === posts.userID);
  const strippedStatus = stripHtmlTags(posts?.status);

  return isConnected || currentUser.id === posts.userID ? (
    <div className="posts-card" key={id}>
      <div className="post-image-wrapper">
        {currentUser.id === posts.userID && (
          <div className="action-container">
            <BsPencil
              size={20}
              className="action-icon"
              onClick={() => getEditData(posts)}
            />
            <BsTrash
              size={20}
              className="action-icon"
              onClick={() => deletePost(posts.id)}
            />
          </div>
        )}

        <img
          alt="profile-image"
          className="profile-image"
          src={user?.imageLink}
        />
        <div>
          <p
            className="name"
            onClick={() =>
              navigate("/profile", {
                state: { id: posts?.userID, email: posts.userEmail },
              })
            }
          >
            {user?.name}
          </p>
          <p className="headline">{user?.headline}</p>
          <p className="timestamp">{posts?.timeStamp}</p>
        </div>
      </div>
      {posts?.postImage && (
        <img
          onClick={() => setImageModal(true)}
          src={posts.postImage}
          className="post-image"
          alt="post-image"
        />
      )}
      <p
        className="status"
        dangerouslySetInnerHTML={{ __html: posts?.status }}
      ></p>

      <LikeButton
        userId={currentUser?.id}
        postId={posts?.id}
        currentUser={currentUser}
      />

      <Modal
        centered
        open={imageModal}
        onOk={() => setImageModal(false)}
        onCancel={() => setImageModal(false)}
        footer={[]}
      >
        <img
          src={posts?.postImage}
          className="post-image modal"
          alt="post-image"
        />
      </Modal>

      <Ally
        currentUser={currentUser}
        posts={posts}
        allUsers={allUsers}
        requests={requests}
        handleUpdateRequestStatus={handleUpdateRequestStatus}
        stripHtmlTags={stripHtmlTags}
      />
    </div>
  ) : null;
}
