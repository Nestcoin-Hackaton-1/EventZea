import React, { useEffect, useState, useRef } from "react";
import { BigNumber, ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import Web3 from "web3";
import {
  contractABI,
  contractAddress,
  paymentContractABI,
  paymentContractAddress,
} from "../utils/constants";

export const EventContext = React.createContext();

export const EventProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [balancebusd, setBalanceBusd] = useState("");
  const [balancesales, setBalanceSales] = useState("");
  const [networkConnected, setnetworkConnected] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [allowance, setAllowance] = useState("");
  const [popularEvent, setPopularEvent] = useState([]);
  const [discoverEvent, setDiscoverEvent] = useState([]);
  const [myEventList, setMyEventList] = useState([]);
  const [myTicketList, setMyTicketList] = useState([]);
  const [activeTicket, setActiveTicket] = useState([]);
  const [sold, setSold] = useState([]);
  const [allResell, setResell] = useState([]);

  const web3ModalRef = useRef();
  let provider;
  let web3Modal;
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // required
      },
    },
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object

    web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mainnet network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();

    if (chainId == 1) {
      setnetworkConnected("Mainnet");
    }
    if (chainId == 3) {
      setnetworkConnected("Ropsten");
    }
    if (chainId == 4) {
      setnetworkConnected("Rinkeby");
    }
    if (chainId == 5) {
      setnetworkConnected("Goerli");
    }
    if (chainId == 137) {
      setnetworkConnected("Polygon");
    }
    if (chainId == 80001) {
      setnetworkConnected("Mumbai");
    }

    if (chainId !== 4) {
      return NotificationManager.error(
        "Wrong Network...Please change to Rinkeby",
        "Network"
      );
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const createEventContract = async () => {
    const provider = await getProviderOrSigner();
    const signer = provider.getSigner();

    const eventContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    return eventContract;
  };

  const createEventContract2 = async () => {
    const provider1 = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_RINKEBY_URL
    );

    const eventContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider1
    );

    return eventContract;
  };

  const createPaymentContractToken = async () => {
    const provider = await getProviderOrSigner();
    const signer = provider.getSigner();

    const paymentContract = new ethers.Contract(
      paymentContractAddress,
      paymentContractABI,
      signer
    );

    return paymentContract;
  };

  const createPaymentContractToken2 = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_RINKEBY_URL
    );

    const paymentContract = new ethers.Contract(
      paymentContractAddress,
      paymentContractABI,
      provider
    );

    return paymentContract;
  };

  const createEventFun = async (event) => {
    const contract = await createEventContract();
    const {
      name,
      startdate,
      enddate,
      price,
      ticketCount,
      category,
      image,
      location,
    } = event;

    try {
      setLoading(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const txn = await contract.createEvent(
        name,
        startdate,
        enddate,
        price,
        ticketCount,
        category,
        image,
        location,
        {
          gasLimit: 600000,
        }
      );

      await txn.wait(3);
      setLoading(false);
      NotificationManager.success("Event was created successfully", "Success");
      window.location.href = "/";
    } catch (error) {
      setLoading(false);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const getEvents = async () => {
    const contract = await createEventContract2();
    setLoading1(true);
    try {
      const allEvents = await contract.fetchAllEvents();
      const popular = [];
      allEvents.map((item) => {
        if (
          Number(BigNumber.from(item.ticketCount)) -
            Number(BigNumber.from(item.ticketRemaining)) >=
          1
        ) {
          popular.push(item);
        }
      });
      console.log(popular);
      console.log(allEvents);
      setEventList(allEvents);
      setDiscoverEvent(allEvents);
      setPopularEvent(popular);
      setLoading1(false);
    } catch (error) {
      setLoading(false);
      setLoading1(false);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const getMyEvents = async () => {
    const contract = await createEventContract();
    try {
      setLoading1(true);
      const myEvents = await contract.fetchMyEvents();
      console.log("myEvents", myEvents);
      setLoading1(false);
      setMyEventList(myEvents);
    } catch (error) {
      setLoading1(false);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const getTickets = async () => {
    const contract = await createEventContract();
    try {
      setLoading1(true);
      const activeTicket = [];
      const myTickets = await contract.fetchMyTickets();
      console.log("tick", myTickets);
      myTickets.map(async (item) => {
        console.log(new Date(item.startdate * 1000) - new Date().getTime());
        if (new Date(item.startdate * 1000) > new Date().getTime()) {
          activeTicket.push(item);
        }
      });
      console.log("active", activeTicket);
      setLoading1(false);
      setMyTicketList(myTickets);
      setActiveTicket(activeTicket);
    } catch (error) {
      setLoading1(false);
      console.log(error);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const getActiveTickets = async () => {
    const contract = await createEventContract();
    try {
      const activeTicket = [];
      const myTickets = await contract.fetchMyTickets();
      console.log("tick", myTickets);
      myTickets.map(async (item) => {
        console.log(new Date(item.startdate * 1000) - new Date().getTime());
        if (new Date(item.startdate * 1000) > new Date().getTime()) {
          activeTicket.push(item);
        }
      });

      return activeTicket;
    } catch (error) {
      setLoading1(false);
      console.log(error);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const getFlippedTickets = async () => {
    const contract = await createEventContract2();
    try {
      setLoading1(true);
      const flipped = await contract.fetchMyResellEvent();
      console.log(flipped);
      setLoading1(false);
      setSold(flipped);
    } catch (error) {
      setLoading1(false);
      NotificationManager.error(error.reason, "Error");
      console.log(error);
    }
  };

  const getListed = async () => {
    const contract = await createEventContract();
    try {
      setLoading1(true);
      const listed = await contract.fetchAllResell();
      const allEvents = await contract.fetchAllEvents();
      console.log("list", listed);
      const ListedList = [];
      allEvents.forEach((item1) => {
        console.log("run");
        listed.forEach((item2) => {
          console.log(item2.includes(item1.eventId));
          if (
            Number(BigNumber.from(item2.eventId)) ===
              Number(BigNumber.from(item1.eventId)) &&
            Number(BigNumber.from(item2.eventId)) !== 0
          ) {
            console.log("yyy");
            let obj = {
              name: item1.name,
              category: item1.category,
              startdate: item1.startdate,
              image: item1.image,
              location: item1.location,
              price: item2.price,
              owner: item2.admin,
              resellId: item2.resellId,
              eventId: item2.eventId,
            };
            ListedList.push(obj);
          }
        });
      });
      console.log("new", ListedList);
      setResell(ListedList);
      setLoading1(false);
    } catch (error) {
      setLoading1(false);
      NotificationManager.error(error.reason, "Error");
      console.log(error);
    }
  };

  const listTicket = async (eventId, price) => {
    const contract = await createEventContract();
    try {
      setLoading(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const tx = await contract.listTicket(
        eventId,
        ethers.utils.parseEther(price)
      );
      await tx.wait(1);
      setLoading(false);
      NotificationManager.success("Transaction successful", "Success");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const search = (evt) => {
    console.log(evt.target.value);
    const result = eventList.filter((item) => {
      return item.name.toLowerCase().includes(evt.target.value.toLowerCase());
    });

    if (evt.target.value === "") {
      setDiscoverEvent([...eventList]);
    }

    console.log("result", result);

    setDiscoverEvent(result);
  };

  const checkAllowance = async (owner, spender) => {
    const contract = await createPaymentContractToken();
    try {
      const allow = await contract.allowance(owner, spender);
      console.log(Number(BigNumber.from(allow)));
      setAllowance(allow);
    } catch (error) {
      console.log(error);
    }
  };

  const check = async (eventId, addr) => {
    const contract = await createEventContract();
    try {
      const res = await contract.checkIfListed(eventId, addr);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const approveAmount = async () => {
    const contract = await createPaymentContractToken();
    try {
      setLoading(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const allow = await contract.approve(
        contractAddress,
        ethers.utils.parseEther("100")
      );
      await allow.wait(1);
      setLoading(false);
      NotificationManager.success("Approval successfull", "Success");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const connectWallet = async () => {
    try {
      // When used for the first time, it prompts the user to connect their wallet
      web3Modal = new Web3Modal({
        network: "rinkeby", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const prov = web3Provider;

      const { chainId } = await prov.getNetwork();

      if (chainId == 1) {
        setnetworkConnected("Mainnet");
      }
      if (chainId == 3) {
        setnetworkConnected("Ropsten");
      }
      if (chainId == 4) {
        setnetworkConnected("Rinkeby");
      }
      if (chainId == 5) {
        setnetworkConnected("Goerli");
      }
      if (chainId == 137) {
        setnetworkConnected("Polygon");
      }
      if (chainId == 80001) {
        setnetworkConnected("Mumbai");
      }

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      if (chainId !== 4) {
        setCurrentAccount("");
        localStorage.removeItem("wall");
        web3Modal = new Web3Modal({
          network: "rinkeby", // optional
          cacheProvider: true, // optional
          providerOptions, // required
        });
        await web3Modal.clearCachedProvider();
        NotificationManager.error(
          "Wrong Network...Please change to Rinkeby",
          "Network"
        );
        //getEvents();
      } else {
        setCurrentAccount(accounts[0]);
        checkAllowance(accounts[0], contractAddress);

        const contract = await createPaymentContractToken();
        const contract2 = await createEventContract();

        const busdBalance = await contract.balanceOf(accounts[0]);
        const salesBalance = await contract2.SalesBalance(accounts[0]);
        setBalanceBusd(Number(BigNumber.from(busdBalance)) / 10 ** 18);
        setBalanceSales(Number(BigNumber.from(salesBalance)) / 10 ** 18);
      }

      const bal = await prov.getBalance(accounts[0]);
      setBalance(Number(BigNumber.from(bal)) / 10 ** 18);

      // track when wallet is connected
      localStorage.setItem("wall", "true");

      // Subscribe to accounts change
      provider.on("accountsChanged", async (accounts) => {
        if (accounts[0]) {
          const provider = new ethers.providers.JsonRpcProvider(
            process.env.REACT_APP_RINKEBY_URL
          );
          const bal = await provider.getBalance(accounts[0]);
          setBalance(Number(BigNumber.from(bal)) / 10 ** 18);
          setCurrentAccount(accounts[0]);
        }
      });

      // Subscribe to chainId change
      provider.on("chainChanged", async (chainId) => {
        console.log("chain", chainId);
        await getProviderOrSigner();
        getEvents();
      });

      // Subscribe to provider connection
      provider.on("connect", async (info) => {
        console.log("inf", info);
      });

      // Subscribe to provider disconnection
      provider.on("disconnect", (error) => {
        console.log("dis", error);
        setCurrentAccount("");
      });
    } catch (err) {
      console.error(err);
    }
  };

  const buy = async (eventId) => {
    const contract = await createEventContract();
    try {
      setLoading(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const tx = await contract.buyTicket(eventId);
      await tx.wait(1);
      setLoading(false);
      NotificationManager.success("Transaction successful", "Success");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      NotificationManager.error(error.reason, "Error");
      console.log(error.message);
    }
  };

  const sell = async (resellId, eventId, owner_addr) => {
    const contract = await createEventContract();
    try {
      setLoading(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const tx = await contract.sellTicket(resellId, eventId, owner_addr);
      await tx.wait(1);
      setLoading(false);
      NotificationManager.success("Transaction successful", "Success");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      NotificationManager.error(error.reason, "Error");
    }
  };

  const disconnectWallet = async () => {
    console.log("working");
    localStorage.removeItem("wall");
    web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });
    await web3Modal.clearCachedProvider();
    setCurrentAccount("");
  };

  useEffect(() => {
    if (localStorage.getItem("wall")) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
    }

    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
  }, [currentAccount]);

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <EventContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        createEventFun,
        checkAllowance,
        approveAmount,
        buy,
        getMyEvents,
        getTickets,
        getFlippedTickets,
        getListed,
        search,
        listTicket,
        getActiveTickets,
        allResell,
        check,
        sell,
        sold,
        myTicketList,
        myEventList,
        activeTicket,
        popularEvent,
        discoverEvent,
        allowance,
        eventList,
        loading1,
        loading,
        balance,
        currentAccount,
        networkConnected,
        balancebusd,
        balancesales,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
