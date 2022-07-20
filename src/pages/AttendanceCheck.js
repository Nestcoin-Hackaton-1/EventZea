import React, { useState, useContext, useRef } from "react";
import { BigNumber, ethers, providers } from "ethers";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { EventContext } from "../context/EventContext";
import { NotificationManager } from "react-notifications";

export default function AttendanceCheck() {
  const { loading, createEventFun, checkAttendance } = useContext(EventContext);
  const [check, setCheck] = useState("");

  const nameRef = useRef();
  const eventRef = useRef();
  const enddateRef = useRef();
  const priceRef = useRef();
  const ticketRef = useRef();
  const categoryRef = useRef();
  const locationRef = useRef();

  const create = async (evt, eventId) => {
    evt.preventDefault();
    if (nameRef.current.value === "" || eventRef.current.value === "") {
      return NotificationManager.error("Please enter all details", "Error");
    }
    const result = await checkAttendance(
      eventRef.current.value,
      nameRef.current.value
    );

    console.log(result);
    setCheck(result);
  };
  return (
    <div>
      <Sidebar />
      <Header />
      <main>
        <form>
          <section className="event-section1">
            <div className="event-text1">Event Check</div>
            <div className="line-flex">
              <div className="line1"></div>
              <div className="line2"></div>
            </div>

            <div className="event-form">
              <div className="input-box">
                <div className="event-title">EventId</div>
                <div>
                  <input
                    ref={eventRef}
                    className="event-input"
                    placeholder="Enter event title"
                    required
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Address</div>
                <div>
                  <input
                    ref={nameRef}
                    className="event-input"
                    placeholder="Enter event title"
                    required
                  />
                </div>
              </div>

              {loading === true ? (
                ""
              ) : check === true ? (
                <div className="home-text4 ">Attendance Confirmed</div>
              ) : check === false ? (
                <div className="home-text4 ">Attendance Not Confirmed</div>
              ) : null}

              <button className="create-but" onClick={create}>
                Event Check
              </button>
            </div>
          </section>
        </form>
      </main>
      {loading === true ? (
        <div className="loading-card">
          <div>
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          </div>
          <div className="loading-text">Trasaction in Progress</div>
        </div>
      ) : null}
    </div>
  );
}
