import axios from "axios";

export const AddControlRoom = (data) => {
  return axios.post("http://127.0.0.1:8000/control-room/reg/", data);
};

export const GetControlRoom = () => {
  return axios.get("http://127.0.0.1:8000/control-room/reg/");
};

export const UpdateControlRoom = (data, id) => {
  return axios.put(`http://127.0.0.1:8000/control-room/reg/${id}/`, data);
};

export const DeleteControlRoom = (id) => {
  return axios.delete(`http://127.0.0.1:8000/user/${id}/`);
};

export const PostLocation = (data) => {
  return axios.post("http://127.0.0.1:8000/location/", data);
};

export const GetLocation = () => {
  return axios.get("http://127.0.0.1:8000/location/");
};

export const GetUser = () => {
  return axios.get("http://127.0.0.1:8000/user/");
};

export const GetUserList = () => {
  return axios.get("http://127.0.0.1:8000/userlist/");
};

export const TokenLogin = async (data) => {
  return axios.post("http://127.0.0.1:8000/token/", data);
};

export const addFeedbackUrl = async (data) => {
  const token = sessionStorage.getItem("token");

  return await axios.post(`http://127.0.0.1:8000/feedback/`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: ` Token ${token}`,
    },
  });
};

export const GetFeedback = () => {
  return axios.get("http://127.0.0.1:8000/admin_feedback/");
};

export const getMessages = (token, id) => {
  return axios.get(`http://127.0.0.1:8000/chat/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

export const sendMessage = (token, id, message) => {
  return axios.post(
    `http://127.0.0.1:8000/chat/${id}/`,
    { message },
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
};

export const sendOtp = async (data) => {
  return axios.post("http://127.0.0.1:8000/email/otp", data);
};

export const registerUser = async (data) => {
  return axios.post("http://127.0.0.1:8000/user/", data);
};

export const resetPassword = (data) => {
  return axios.put("http://127.0.0.1:8000/reset-password", data);
};

