import { useState } from "react";
import ReactLoading from "react-loading";
import { useNetwork } from "wagmi";

import AddressProvider from "../components/address";
import { Connect } from "../components/connect";
import { Send } from "../components/send";
import { Withdraw } from "../components/withdraw";
import { TransactionPool } from "../components/tsx-pools";

import Banner from "../components/banner";
import ZkmlId from "../components/zkmlid";

import SendMoneyIcon from "../assets/svg/MoneySendCircle.svg";
import ReceiveMoneyIcon from "../assets/svg/MoneyReceiveCircle.svg";
import PoolIcon from "../assets/svg/DataPool.svg";
import Logo from "../assets/logo.svg";
import "./main.css";

const Dapp = () => {
  const [activeTab, setActiveTab] = useState<string>("send");
  const [isLoading, setIsLoading] = useState(false);

  const { chain } = useNetwork();

  return (
    <>
      {chain?.id == 1440002 && <Banner></Banner>}
      <section className="layout">
        <div className="header">
          <div className="">
            <img className="logo" src={Logo} />
          </div>
          <div className="connect-wallet">
            <Connect />
          </div>
        </div>
        <AddressProvider>
          <ZkmlId></ZkmlId>
          <div className="main-panel">
            <div className="nav-tabs">
              <div
                className={activeTab === "send" ? "tab active" : "tab"}
                onClick={() => setActiveTab("send")}
              >
                <h2>Send</h2>
                <img src={SendMoneyIcon}></img>
              </div>
              <div
                className={activeTab === "withdraw" ? "tab active" : "tab"}
                onClick={() => setActiveTab("withdraw")}
              >
                <h2>Receive</h2>
                <img src={ReceiveMoneyIcon}></img>
              </div>

              <div
                className={activeTab === "spend" ? "tab active" : "tab"}
                onClick={() => setActiveTab("spend")}
              >
                <h2>Pool</h2>
                <img src={PoolIcon}></img>
              </div>
            </div>
            <div
              className="pane send"
              style={{ display: activeTab === "send" ? "block" : "none" }}
            >
              <Send setIsLoading={setIsLoading} />
            </div>
            <div
              className="pane receive"
              style={{
                display: activeTab === "withdraw" ? "block" : "none",
              }}
            >
              <Withdraw setIsLoading={setIsLoading} activeTab={activeTab} />
            </div>
            <div
              className="pane datapool"
              style={{ display: activeTab === "spend" ? "block" : "none" }}
            >
              <TransactionPool activeTab={activeTab} />
            </div>
          </div>
        </AddressProvider>
        {isLoading && (
          <div className="loading">
            <ReactLoading type="bars" color="#38E5FF" />
          </div>
        )}
      </section>
    </>
  );
};
export default Dapp;
