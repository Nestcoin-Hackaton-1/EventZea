import React, { useRef, useContext, useState } from "react";
import { BigNumber, ethers, providers } from "ethers";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { EventContext } from "../context/EventContext";

export default function Resell() {
  const {
    loading1,
    myTicketList,
    allResell,
    sell,
    allowance,
    approveAmount,
    sold,
    listTicket,
    loading,
    myEventList,
  } = useContext(EventContext);
  return (
    <div>
      <Sidebar />
      <div className="disc">
        <Header />
        <div className="disc-inner">
          <input
            className="disc-but"
            placeholder="Search event names,organizers "
          />
        </div>
      </div>
      <main>
        <section className="home-section1">
          <div className="home-section1-inner">
            <div className="home-text2">Flipped Tickets</div>
            <div className="home-flow">
              {loading1 && allResell.length === 0 ? (
                <div
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontSize: "24px",
                  }}
                >
                  Loading.......
                </div>
              ) : null}
              {allResell.map((item) => {
                return (
                  <div className="home-box">
                    <img
                      className="evimg"
                      alt="resell"
                      src={item.image || "./images/image.png"}
                    />
                    <div className="inner-box">
                      <div className="home-text3">{item.name}</div>
                      <div className="home-text4">
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toDateString()}{" "}
                        ||{" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toLocaleTimeString()}
                      </div>
                      <div className="home-text5">{item.location}</div>
                      <div className="home-text5">
                        Listed by{" "}
                        {item.owner.slice(0, 5) +
                          "....." +
                          item.owner.slice(-5)}
                      </div>
                      <div className="home-text6">
                        {ethers.utils.formatEther(item.price)} BUSD
                      </div>
                      {Number(BigNumber.from(allowance || 0)) >
                      Number(BigNumber.from(item.price)) ? (
                        <button
                          className="flip"
                          onClick={() =>
                            sell(
                              Number(BigNumber.from(item.resellId)),
                              Number(BigNumber.from(item.eventId)),
                              item.owner
                            )
                          }
                        >
                          Buy Ticket
                        </button>
                      ) : (
                        <button className="flip" onClick={approveAmount}>
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {allResell.length === 0 ? (
                <div className="no-event2">No Listed Ticket</div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
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
