import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { sendCollaborationRequest } from "../../../api/FirestoreAPI";

export default function Ally({ currentUser, posts, allUsers, requests, handleUpdateRequestStatus, stripHtmlTags }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendRequest = () => {
    sendCollaborationRequest(currentUser.id, posts.userID, posts.id, message);
    setModalVisible(false);
  };

  const user = allUsers.find((user) => user.id === posts.userID);
  const strippedStatus = stripHtmlTags(posts?.status);

  return (
    <div className="ally">
      <Button onClick={() => setModalVisible(true)}>Collaborate</Button>

      <Modal
        title="Send Collaboration Request"
        centered
        visible={modalVisible}
        onOk={handleSendRequest}
        onCancel={() => setModalVisible(false)}
        okText="Submit"
      >
        <Input.TextArea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Why do you want to collaborate?"
        />
      </Modal>

      <div className="collaboration-requests">
        {requests
          .filter((request) => request.postId === posts.id) // Filter requests for the specific post
          .map((request) => {
            const requester = allUsers.find((user) => user.id === request.requesterId);
            return (
              <div key={request.id} className="request-card">
                <p>
                  {requester?.name} wants to collaborate on your project "{strippedStatus}".
                  <br />
                  Message: {request.message}
                </p>
                <Button onClick={() => handleUpdateRequestStatus(request.id, "accepted")}>Accept</Button>
                <Button onClick={() => handleUpdateRequestStatus(request.id, "declined")}>Decline</Button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
