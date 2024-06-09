import { firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { toast } from "react-toastify";

let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentsRef = collection(firestore, "comments");
let connectionRef = collection(firestore, "connections");
let collaborationsRef = collection(firestore, "collaborations");
let projectsRef = collection(firestore, "projects");



export const postStatus = (object) => {
  addDoc(postsRef, object)
    .then(() => {
      toast.success("Post has been added successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getStatus = (setAllStatus) => {
  const q = query(postsRef, orderBy("timeStamp"));
  onSnapshot(q, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getAllUsers = (setAllUsers) => {
  onSnapshot(userRef, (response) => {
    setAllUsers(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleStatus = (setAllStatus, id) => {
  const singlePostQuery = query(postsRef, where("userID", "==", id));
  onSnapshot(singlePostQuery, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleUser = (setCurrentUser, email) => {
  const singleUserQuery = query(userRef, where("email", "==", email));
  onSnapshot(singleUserQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })[0]
    );
  });
};

export const postUserData = (object) => {
  addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export const getCurrentUser = (setCurrentUser) => {
  onSnapshot(userRef, (response) => {
    setCurrentUser(
      response.docs
        .map((docs) => {
          return { ...docs.data(), id: docs.id };
        })
        .filter((item) => {
          return item.email === localStorage.getItem("userEmail");
        })[0]
    );
  });
};

export const editProfile = (userID, payload) => {
  let userToEdit = doc(userRef, userID);

  updateDoc(userToEdit, payload)
    .then(() => {
      toast.success("Profile has been updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const likePost = (userId, postId, liked) => {
  try {
    let docToLike = doc(likeRef, `${userId}_${postId}`);
    if (liked) {
      deleteDoc(docToLike);
    } else {
      setDoc(docToLike, { userId, postId });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
  try {
    let likeQuery = query(likeRef, where("postId", "==", postId));

    onSnapshot(likeQuery, (response) => {
      let likes = response.docs.map((doc) => doc.data());
      let likesCount = likes?.length;

      const isLiked = likes.some((like) => like.userId === userId);

      setLikesCount(likesCount);
      setLiked(isLiked);
    });
  } catch (err) {
    console.log(err);
  }
};

export const postComment = (postId, comment, timeStamp, name) => {
  try {
    addDoc(commentsRef, {
      postId,
      comment,
      timeStamp,
      name,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getComments = (postId, setComments) => {
  try {
    let singlePostQuery = query(commentsRef, where("postId", "==", postId));

    onSnapshot(singlePostQuery, (response) => {
      const comments = response.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setComments(comments);
    });
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = (id, status, postImage) => {
  let docToUpdate = doc(postsRef, id);
  try {
    updateDoc(docToUpdate, { status, postImage });
    toast.success("Post has been updated!");
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (id) => {
  let docToDelete = doc(postsRef, id);
  try {
    deleteDoc(docToDelete);
    toast.success("Post has been Deleted!");
  } catch (err) {
    console.log(err);
  }
};

export const addConnection = (userId, targetId) => {
  try {
    let connectionToAdd = doc(connectionRef, `${userId}_${targetId}`);

    setDoc(connectionToAdd, { userId, targetId });

    toast.success("Connection Added!");
  } catch (err) {
    console.log(err);
  }
};

export const getConnections = (userId, targetId, setIsConnected) => {
  try {
    let connectionsQuery = query(
      connectionRef,
      where("targetId", "==", targetId)
    );

    onSnapshot(connectionsQuery, (response) => {
      let connections = response.docs.map((doc) => doc.data());

      const isConnected = connections.some(
        (connection) => connection.userId === userId
      );

      setIsConnected(isConnected);
    });
  } catch (err) {
    console.log(err);
  }
};


// Add a reference to the new collaborations collection

export const sendCollaborationRequest = (requesterId, receiverId, postId, message) => {
  addDoc(collaborationsRef, {
    requesterId,
    receiverId,
    postId,
    message, // Include the message field
    status: "pending",
  })
    .then(() => {
      toast.success("Collaboration request sent successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};


// Function to get collaboration requests
export const getCollaborationRequests = (receiverId, setRequests) => {
  const q = query(collaborationsRef, where("receiverId", "==", receiverId), where("status", "==", "pending"));
  onSnapshot(q, (response) => {
    setRequests(
      response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  });
};


// Function to add a new project
export const addProject = async (projectData) => {
  try {
    const docRef = await addDoc(projectsRef, projectData);
    return docRef.id; // Return the ID of the newly created project
  } catch (error) {
    console.error("Error adding project: ", error);
    throw error;
  }
};

// Function to fetch all projects
export const getProjects = async () => {
  try {
    const querySnapshot = await getDocs(projectsRef);
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

// Function to update a project
export const updateProject = async (projectId, newData) => {
  try {
    const projectDocRef = doc(projectsRef, projectId);
    await updateDoc(projectDocRef, newData);
    console.log("Project updated successfully");
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

export const createGroup = async (members) => {
  try {
    const docRef = await addDoc(collection(firestore, "groups"), { members });
    return docRef.id; // Return the ID of the newly created group
  } catch (error) {
    console.error("Error creating group: ", error);
    throw error;
  }
};

// Function to update collaboration request status and store collaborating users
export const updateCollaborationStatus = async (requestId, status, postId, collaboratingUsers) => {
  const docToUpdate = doc(collaborationsRef, requestId);
  await updateDoc(docToUpdate, { status });

  // If the collaboration request is accepted, store collaborating users in a separate collection
  if (status === "accepted") {
    collaboratingUsers.forEach(async (userId) => {
      try {
        await addDoc(collection(firestore, "collaboratingUsers"), { userId, postId });
      } catch (error) {
        console.error("Error adding collaborating user: ", error);
        throw error;
      }
    });
  }
};

// Function to fetch collaborating users for a project
export const getCollaboratingUsers = async (postId) => {
  try {
    const collaboratingUsersRef = collection(firestore, "collaboratingUsers");
    const q = query(collaboratingUsersRef, where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    const collaboratingUsers = querySnapshot.docs.map((doc) => doc.data().userId);
    return collaboratingUsers;
  } catch (error) {
    console.error("Error fetching collaborating users: ", error);
    throw error;
  }
};