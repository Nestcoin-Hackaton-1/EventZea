import React, { useState, useContext, useRef } from "react";
import { BigNumber, ethers, providers } from "ethers";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { EventContext } from "../context/EventContext";
import { NotificationManager } from "react-notifications";

export default function EventPage() {
  const { loading, createEventFun } = useContext(EventContext);
  const [file, setFile] = useState("");
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const client = new Web3Storage({
        token: process.env.REACT_APP_TOKEN,
      });

      const cid = await client.put(e.target.files, {
        name: file.name,
        maxRetries: 3,
      });

      const url = `https://ipfs.io/ipfs/${cid}/${file.name}`;
      console.log(url);
      setFile(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const nameRef = useRef();
  const startdateRef = useRef();
  const enddateRef = useRef();
  const priceRef = useRef();
  const ticketRef = useRef();
  const categoryRef = useRef();
  const locationRef = useRef();

  const create = async (evt) => {
    evt.preventDefault();
    if (
      nameRef.current?.value === "" ||
      startdateRef.current?.value === "" ||
      enddateRef.current?.value === "" ||
      priceRef.current?.value === "" ||
      ticketRef.current?.value === "" ||
      categoryRef.current?.value === "" ||
      locationRef.current?.value === ""
    ) {
      return NotificationManager.error(
        "Please enter all required fields",
        "Error"
      );
    }

    if (
      new Date(startdateRef.current.value).getTime() <= new Date().getTime()
    ) {
      return NotificationManager.error(
        "Event can only be created in future date",
        "Error"
      );
    }

    if (
      new Date(startdateRef.current.value).getTime() >
      new Date(enddateRef.current.value).getTime()
    ) {
      return NotificationManager.error(
        "End Date must be greater than start date",
        "Error"
      );
    }
    const eventObject = {
      name: nameRef.current.value,
      startdate: Math.floor(
        new Date(startdateRef.current.value).getTime() / 1000
      ),
      enddate: Math.floor(new Date(enddateRef.current.value).getTime() / 1000),
      price: ethers.utils.parseEther(priceRef.current.value),
      ticketCount: ticketRef.current.value,
      category: categoryRef.current.value,
      image: file,
      location: locationRef.current.value,
    };

    await createEventFun(eventObject);

    nameRef.current.value = "";
    startdateRef.current.value = "";
    enddateRef.current.value = "";
    priceRef.current.value = "";
    ticketRef.current.value = "";
    categoryRef.current.value = "";
    locationRef.current.value = "";
  };
  return (
    <div>
      <Sidebar />
      <Header />
      <main>
        <form>
          <section className="event-section1">
            <div className="event-text1">Create an Event</div>
            <div className="line-flex">
              <div className="line1"></div>
              <div className="line2"></div>
            </div>

            <div className="event-form">
              <div className="input-box">
                <div className="event-title">Event Title</div>
                <div>
                  <input
                    ref={nameRef}
                    className="event-input"
                    placeholder="Enter event title"
                    required
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Event Location</div>
                <div>
                  <input
                    ref={locationRef}
                    required
                    className="event-input"
                    placeholder="Enter event location"
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Select Event Image</div>
                <div>
                  <input
                    required
                    className="event-input"
                    type="file"
                    onChange={onChange}
                    accept="image/*"
                    placeholder="Enter event location"
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Category</div>
                <div>
                  <select className="event-input" required ref={categoryRef}>
                    <option value="">Select</option>
                    <option value="art">Art</option>
                    <option value="design">Design</option>
                    <option value="fashion">Fashion</option>
                    <option value="tech">Tech</option>
                    <option value="music">Music</option>
                    <option value="business">Business</option>
                    <option value="sport">Sport</option>
                    <option value="comedy">Comedy</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Set Ticket Price</div>
                <div>
                  <input
                    required
                    ref={priceRef}
                    className="event-input"
                    placeholder="e.g 0.67 USDT"
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Set Ticket Count</div>
                <div>
                  <input
                    required
                    ref={ticketRef}
                    className="event-input"
                    placeholder="Enter the number of tickets available"
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Set Event Start Date</div>
                <div>
                  <input
                    required
                    ref={startdateRef}
                    type="datetime-local"
                    className="event-input"
                    placeholder="Which day is the event ?"
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="event-title">Set Event End Date</div>
                <div>
                  <input
                    required
                    ref={enddateRef}
                    type="datetime-local"
                    className="event-input"
                    placeholder="Which day  is the event ?"
                  />
                </div>
              </div>

              <button className="create-but" onClick={create}>
                Create Event
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
