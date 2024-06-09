import React, { useState, useMemo } from "react";
import { postStatus, getStatus, updatePost } from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import ModalComponent from "../Modal";
import { uploadPostImage } from "../../../api/ImageUpload";
import { getUniqueID } from "../../../helpers/getUniqueId";
import PostsCard from "../PostsCard";
import "./index.scss";

export default function PostStatus({ currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [allStatuses, setAllStatus] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [postImage, setPostImage] = useState("");

  const sendStatus = async () => {
    if (!currentUser) {
      console.error("Current user is not defined");
      return;
    }

    let object = {
      status: status,
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: currentUser?.email || "unknown",
      userName: currentUser?.name || "unknown",
      postID: getUniqueID(),
      userID: currentUser?.id || "unknown",
      postImage: postImage,
    };

    try {
      await postStatus(object);
      setModalOpen(false);
      setIsEdit(false);
      setStatus("");
    } catch (error) {
      console.error("Error posting status:", error);
    }
  };

  const getEditData = (posts) => {
    setModalOpen(true);
    setStatus(posts?.status);
    setCurrentPost(posts);
    setIsEdit(true);
  };

  const updateStatus = async () => {
    try {
      await updatePost(currentPost.id, status, postImage);
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  useMemo(() => {
    getStatus(setAllStatus);
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return (
    <div className="post-status-main">
      <div className="user-details">
        <img src={currentUser?.imageLink} alt="User profile" />
        <p className="name">{currentUser?.name}</p>
        <p className="headline">{currentUser?.headline}</p>
      </div>
      <div className="post-status">
        <img
          className="post-image"
          src={currentUser?.imageLink}
          alt="User profile"
        />
        <button
          className="open-post-modal"
          onClick={() => {
            setModalOpen(true);
            setIsEdit(false);
          }}
        >
          Start a Post
        </button>
      </div>

      <ModalComponent
        setStatus={setStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        status={status}
        sendStatus={sendStatus}
        isEdit={isEdit}
        updateStatus={updateStatus}
        uploadPostImage={uploadPostImage}
        postImage={postImage}
        setPostImage={setPostImage}
        setCurrentPost={setCurrentPost}
        currentPost={currentPost}
      />

      <div>
        {allStatuses.map((posts) => (
          <div key={posts.id}>
            <PostsCard posts={posts} getEditData={getEditData} />
          </div>
        ))}
      </div>
    </div>
  );
}
