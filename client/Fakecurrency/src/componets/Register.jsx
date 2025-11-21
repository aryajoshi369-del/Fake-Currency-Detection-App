import React, { useEffect, useState } from "react";
import { GetLocation, registerUser, sendOtp } from "../api/allApi";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [location, setlocation] = useState([]);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate()
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setuserrData] = useState({
    first_name: "",
    username: "",
    email: "",
    location: "",
    password: "",
    otp: "",
  });

  const handleGetOtp = (e) => {
    setloading(true);
    e.preventDefault();
    sendOtp({ email: userData.email }).then((res) => {
      toast.success("email send");
      setShowOtpSection(true);
      setloading(false);
    })
  };

  useEffect(() => {
    const fetchlocation = () => {
      GetLocation().then((res) => {
        setlocation(res.data);
      });
    };
    fetchlocation();
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handlesubmit = (event) => {
    event.preventDefault();
    const otpString = otp.join("");
    const data = {
      first_name: userData.first_name,
      username: userData.username,
      email: userData.email,
      location: userData.location,
      password: userData.password,
      otp: otpString,
    };
    registerUser(data).then((res) => {
      
      setuserrData({
        first_name: "",
        username: "",
        email: "",
        location: "",
        password: "",
        otp: "",
      });
      navigate('/login')
      
    }).catch(() => {
      toast.warning("Registration failed. Please try again.");
    });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer/>
      <div className="container-fluid pt-4 px-4">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-6">
            <div className="bg-secondary rounded p-4">
              <h4 className="mb-4 text-center">User Registration Form</h4>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={userData.first_name}
                    onChange={(e) =>
                      setuserrData({ ...userData, first_name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={userData.email}
                    onChange={(e) =>
                      setuserrData({ ...userData, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <select
                    className="form-select mb-3"
                    aria-label="Default select example"
                    value={userData.location}
                    onChange={(e) =>
                      setuserrData({ ...userData, location: e.target.value })
                    }
                  >
                    <option>Select Location</option>
                    {location.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                {!showOtpSection ? (
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    onClick={!showOtpSection ? handleGetOtp : undefined}
                  >
                    {loading ? "Loading..." : "Get OTP"}
                  </button>
                ) : (
                  <>
                    <div className="mb-3 text-center">
                      <label htmlFor="otp" className="form-label">
                        Enter OTP
                      </label>
                      <div className="d-flex justify-content-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            className="form-control text-center"
                            style={{ width: "50px" }}
                            maxLength="1"
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={userData.username}
                        onChange={(e) =>
                          setuserrData({
                            ...userData,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={userData.password}
                        onChange={(e) =>
                          setuserrData({
                            ...userData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      onClick={handlesubmit}
                    >
                      Register
                    </button>
                  </>
                )}
              </form>
              <p className="text-center mb-0 p-3">
                Already have an Account? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;


