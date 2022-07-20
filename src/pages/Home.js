import React, { useRef, useEffect, useState, useContext } from "react";
import { BigNumber, ethers, providers } from "ethers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { EventContext } from "../context/EventContext";

export default function Home() {
  const { eventList, loading1, allowance, loading, approveAmount, buy } =
    useContext(EventContext);
  const marqueeTexts = [
    "Create Events",
    "Sell Tickets",
    "Buy Tickets",
    "Accept Crypto Payments",
  ];

  const marqueeElements = useRef([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const marqueeTween = useRef();

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      marqueeTween.pause().kill();
    };
  }, []);

  useEffect(() => {
    marqueeInitialSet();
    marqueeTween.current && marqueeTween.current.pause().kill();
    marqueeTween.current = gsap.to(marqueeElements.current, {
      x: `+=${screenWidth * 1.5}`,
      ease: "none",
      repeat: -1,
      duration: 10,
      rotation: 0.1,
      modifiers: {
        x: (x) => {
          return (parseFloat(x) % (screenWidth * 1)) + "px";
        },
      },
    });
  }, [screenWidth]);

  const marqueeInitialSet = () => {
    gsap.set(marqueeElements.current, {
      xPercent: -100,
      x: function (index) {
        return (screenWidth / 3) * index;
      },
    });
  };

  const resizeHandler = () => {
    gsap.set(marqueeElements.current, { clearProps: "all" });
    setScreenWidth(window.innerWidth);
  };

  const marqueeElementsRefHandler = (e, i) => {
    marqueeElements.current[i] = e;
  };

  const renderMarqueeElements = () => {
    if (marqueeTexts.length === 1) {
      marqueeTexts[3] = marqueeTexts[2] = marqueeTexts[1] = marqueeTexts[0];
    }
    if (marqueeTexts.length === 3) {
      marqueeTexts[3] = marqueeTexts[0];
    }
    return marqueeTexts.map((e, i) => (
      <span
        className="moving"
        key={`marquee-${i}`}
        ref={(el) => marqueeElementsRefHandler(el, i)}
      >
        {e}
      </span>
    ));
  };

  return (
    <div>
      <Sidebar />
      <div className="event">
        <Header />

        <div className="home-text1">Buy event tickets using crypto</div>

        <div>
          <button className="home-discover-but">
            <Link to="/discover" className="anone">
              Discover your next event
            </Link>
          </button>

          <button className="home-discover-but1">
            <Link to="/event" className="anone">
              Create your event
            </Link>
          </button>
        </div>

        <div className="home-category">
          <div>Arts</div>
          <div>Design</div>
          <div>Fashion</div>
          <div>Tech</div>
          <div>Music</div>
        </div>
        <div className="home-category2">
          <div>Business</div>
          <div>Sports</div>
          <div>Comedy</div>
          <div>Health</div>
          <div>Education</div>
        </div>
      </div>

      <main>
        <section className="home-section1">
          <div className="home-section1-inner">
            <div className="home-text2">Upcoming events</div>
            <div className="home-flow">
              {loading1 && eventList.length === 0 ? (
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
              {eventList.map((item) => {
                return (
                  <div className="home-box">
                    <img
                      className="evimg"
                      alt="buy"
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
                      {Number(BigNumber.from(allowance || 0)) >
                      Number(BigNumber.from(item.price)) ? (
                        <button
                          className="flip"
                          onClick={() =>
                            buy(Number(BigNumber.from(item.eventId)))
                          }
                        >
                          Buy Ticket
                        </button>
                      ) : (
                        <button className="flip" onClick={approveAmount}>
                          Approve
                        </button>
                      )}

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
