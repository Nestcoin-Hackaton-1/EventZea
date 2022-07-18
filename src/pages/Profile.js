import React, { useRef, useContext, useState, useEffect } from "react";
import { BigNumber, ethers, providers } from "ethers";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { EventContext } from "../context/EventContext";

export default function Profile() {
  const {
    loading1,
    myTicketList,
    activeTicket,
    currentAccount,
    sold,
    listTicket,
    getActiveTickets,
    check,
    loading,
    myEventList,
    balancebusd,
    balancesales,
  } = useContext(EventContext);
  const [profileState, setProfile] = useState("event");
  const [priceState, setPriceState] = useState(false);
  const [eventId, setEventId] = useState("");
  const [st, setSt] = useState([]);
  const priceRef = useRef();

  const flip = () => {
    listTicket(eventId, priceRef.current.value);
    setPriceState(false);
  };

  useEffect(async () => {
    if (currentAccount) {
      const ac = await getActiveTickets();
      console.log(currentAccount);
      const statusList = [];

      ac.forEach(async (item) => {
        const status = await check(
          Number(BigNumber.from(item.eventId)),
          currentAccount
        );
        console.log(status);
        statusList.push(status);
        if (statusList.length === ac.length) {
          setSt(statusList);
        }
      });

      console.log(st);
    }
  }, [currentAccount]);

  return (
    <div>
      <Sidebar />
      <Header />
      <main>
        <div className="profile-box">
          <div className="balance-box">
            <div className="balance">Total Wallet Balance</div>
            <div className="busd">{balancebusd} BUSD</div>
          </div>

          <div className="balance-box">
            <div className="balance">Tickets Sold Balance (Available)</div>
            <div className="busd">{balancesales} BUSD</div>
          </div>
        </div>
        <div className="profile-list">
          <div
            className={
              profileState === "event" ? "active profile-item" : "profile-item"
            }
            onClick={() => setProfile("event")}
          >
            My Events
          </div>
          <div
            onClick={() => setProfile("active")}
            className={
              profileState === "active" ? "active profile-item" : "profile-item"
            }
          >
            Active Tickets
          </div>
          <div
            onClick={() => setProfile("sold")}
            className={
              profileState === "sold" ? "active profile-item" : "profile-item"
            }
          >
            Sold Tickets
          </div>
          <div
            onClick={() => setProfile("bought")}
            className={
              profileState === "bought" ? "active profile-item" : "profile-item"
            }
          >
            Bought Tickets
          </div>
        </div>

        {profileState === "event" ? (
          <section className="profile-event">
            <div className="home-flow">
              {loading1 && myEventList.length === 0 ? (
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
              {myEventList.map((item) => {
                return (
                  <div className="home-box">
                    <img
                      className="evimg"
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
                        Organized by{" "}
                        {item.admin.slice(0, 5) +
                          "....." +
                          item.admin.slice(-5)}
                      </div>
                      <div className="home-text6">
                        {ethers.utils.formatEther(item.price)} BUSD
                      </div>
                      <div className="home-text7">
                        <img src="./images/users.svg" />{" "}
                        <span style={{ paddingLeft: "10px" }}>
                          {Number(
                            String(Number(BigNumber.from(item.ticketCount)))
                          ) -
                            Number(
                              String(
                                Number(BigNumber.from(item.ticketRemaining))
                              )
                            )}{" "}
                          people are attending this event
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {myEventList.length === 0 ? (
                <div className="no-event">You have not created any events</div>
              ) : null}
            </div>
          </section>
        ) : profileState === "active" ? (
          <section className="profile-active">
            <div className="home-flow1">
              {loading1 && activeTicket.length === 0 ? (
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
              {activeTicket.map((item, index) => {
                return (
                  <div className="home-box1">
                    <img
                      className="evimg"
                      src={item.image || "./images/image.png"}
                    />

                    <div className="inner-box1">
                      <div className="home-text3">{item.name}</div>
                      <div className="home-text4">
                        {" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toDateString()}
                        at{" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toLocaleTimeString()}
                      </div>
                      <div className="home-text5">{item.location}</div>
                      <div className="home-text5">
                        {" "}
                        Organized by{" "}
                        {item.admin.slice(0, 5) +
                          "....." +
                          item.admin.slice(-5)}
                      </div>
                      <div className="home-text6">
                        {" "}
                        {ethers.utils.formatEther(item.price)} BUSD
                      </div>
                      <button
                        className="flip"
                        onClick={() => {
                          setPriceState(true);
                          setEventId(Number(BigNumber.from(item.eventId)));
                        }}
                      >
                        {st[index] === true ? "Listed" : "List"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {activeTicket.length === 0 ? (
                <div className="no-event">
                  You do not have any active events
                </div>
              ) : null}
            </div>
          </section>
        ) : profileState === "sold" ? (
          <section className="profile-sold">
            <div className="home-flow1">
              {loading1 && sold.length === 0 ? (
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
              {sold.map((item) => {
                return (
                  <div className="home-box1">
                    <img
                      className="evimg"
                      src={item.image || "./images/image.png"}
                    />
                    <div className="inner-box1">
                      <div className="home-text3">{item.name}</div>
                      <div className="home-text4">
                        {" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toDateString()}{" "}
                        at{" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toLocaleTimeString()}
                      </div>
                      <div className="home-text5">{item.location}</div>
                      <div className="home-text5">
                        {" "}
                        Organized by{" "}
                        {item.admin.slice(0, 5) +
                          "....." +
                          item.admin.slice(-5)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {sold.length === 0 ? (
                <div className="no-event">You have not sold any tickets</div>
              ) : null}
            </div>
          </section>
        ) : profileState === "bought" ? (
          <section className="profile-bought">
            <div className="home-flow1">
              {loading1 && myTicketList.length === 0 ? (
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
              {myTicketList.map((item) => {
                return (
                  <div className="home-box1">
                    <img
                      className="evimg"
                      src={item.image || "./images/image.png"}
                    />
                    <div className="inner-box1">
                      <div className="home-text3">{item.name}</div>
                      <div className="home-text4">
                        {" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toDateString()}{" "}
                        at{" "}
                        {new Date(
                          Number(
                            String(Number(BigNumber.from(item.startdate)))
                          ) * 1000
                        ).toLocaleTimeString()}
                      </div>
                      <div className="home-text5">{item.location}</div>
                      <div className="home-text5">
                        {" "}
                        Organized by{" "}
                        {item.admin.slice(0, 5) +
                          "....." +
                          item.admin.slice(-5)}
                      </div>
                      <div className="home-text6">
                        {" "}
                        {ethers.utils.formatEther(item.price)} BUSD
                      </div>
                      <button className="flip">Flip Ticket</button>
                    </div>
                  </div>
                );
              })}

              {myTicketList.length === 0 ? (
                <div className="no-event">You have not bought any ticket</div>
              ) : null}
            </div>
          </section>
        ) : null}
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
      {priceState === true && profileState === "active" ? (
        <div className="loading-card">
          <input
            className="flip-input"
            ref={priceRef}
            placeholder="Enter your selling price"
          />
          <button className="flip-button" onClick={() => flip()}>
            Flip
          </button>
        </div>
      ) : null}
    </div>
  );
}
