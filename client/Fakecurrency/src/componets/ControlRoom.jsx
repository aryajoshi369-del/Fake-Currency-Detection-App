import React, { useState } from "react";
import Chat from "./Chat";
import FakeCurrencyView from "./FakeCurrencyView";
import Logout from "./Logout";

function ControlRoom() {
  const [activesection,setactivesection]=useState('fakecurrency')
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-secondary nav-dark sticky-top px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Fake Currency Detection
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: "white" }} 
            >
            <span
                className="navbar-toggler-icon text-white"
                style={{ filter: "invert(1)" }} 
            ></span>
            </button>

          {/* Navbar links aligned to the right */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
            <ul className="navbar-nav mb-2 mb-lg-0">
            <li className={activesection === "fakecurrency " ? "active" : ""} onClick={() => setactivesection("fakecurrency")}>
                <a className="nav-link me-3 fw-bold" href="#">
                  FakeCurrency
                </a>
              </li>
              <li className={activesection === "chat " ? "active" : ""} onClick={() => setactivesection("chat")}>
              <a href="#" className="nav-link me-3 fw-bold" >
              Chat
              </a>
              </li>
             
              <li className="nav-item">
                <Logout/>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
      {activesection === 'chat' && (
          <div className="container mt-2 w-100" style={{position:'fixed'}}>
            <Chat />
          </div>
        )}

{activesection === 'fakecurrency' && (
          <div className="container mt-2 w-100" style={{position:'fixed'}}>
            <FakeCurrencyView />
          </div>
        )}

      </div>
    </>
  );
}

export default ControlRoom;
