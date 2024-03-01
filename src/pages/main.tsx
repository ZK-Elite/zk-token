/* eslint-disable @typescript-eslint/no-unused-vars */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ReactLoading from "react-loading";
import { useNetwork } from "wagmi";

import AddressProvider from "../components/address";
import { Connect } from "../components/connect";

import Banner from "../components/banner";
import ZkmlId from "../components/zkmldNew";
import { registryAddress, explorer } from "../utils/constants";

import Logo from "../assets/logo.svg";
import "./main.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Send } from "../components/send";
import { SendNew } from "../components/sendNew";
import { Withdraw } from "../components/withdraw";
import { TransactionPool } from "../components/tsx-pools";

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const connected = false;
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(
    null
  );

  const handleButtonClick = (index: number) => {
    setSelectedButtonIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const { chain } = useNetwork();
  const contractAddress = registryAddress[chain?.id || 100 || 10200];
  const explorerAddress = explorer[chain?.id || 100 || 10200];

  return (
    <section className="flex min-h-screen w-full flex-col bg-[url(/bg.png)] bg-cover bg-center bg-no-repeat p-8 pb-4 font-[nekst-regular]">
      {chain?.id == 1440002 && <Banner></Banner>}
      <div className="flex justify-between">
        <div className="">
          <img className="logo" src={Logo} />
        </div>
        <div className="connect-wallet">
          <Connect />
        </div>
      </div>
      <div className="my-6 w-full border border-[#202020]" />
      <AddressProvider>
        <ZkmlId />
        <div className="mt-8 flex h-full w-[100%] gap-y-12 rounded-2xl border border-[#242428] bg-[#14161A] px-2 py-4 max-md:overflow-auto md:p-8">
          <Tabs defaultValue="send" className="w-[100dvw]">
            <TabsList className="flex w-full justify-around font-[Sbold] md:justify-start">
              <TabsTrigger
                value="send"
                className="flex gap-2 rounded-t-2xl px-[63px] py-3 text-[18px] text-[#CAECF1] max-md:flex-col max-md:px-[15px] max-md:py-[3px]"
              >
                <h1>Send</h1>
                <img src="/money-send.png" width={20} height={20} alt="logo" />
              </TabsTrigger>
              <TabsTrigger
                value="receive"
                className="flex gap-2 rounded-t-2xl px-[63px] py-3 text-[18px] text-[#CAECF1] max-md:flex-col max-md:px-[15px] max-md:py-[3px]"
              >
                <h1>Receive</h1>
                <img
                  src="/money-receive.png"
                  width={20}
                  height={20}
                  alt="logo"
                />
              </TabsTrigger>
              <TabsTrigger
                value="dataPool"
                className="flex gap-2 rounded-t-2xl px-[63px] py-3 text-[18px] text-[#CAECF1] max-md:flex-col max-md:px-[15px] max-md:py-[3px]"
              >
                <h1>Data Pool</h1>
                <img src="/data-pool.png" width={20} height={20} alt="logo" />
              </TabsTrigger>
            </TabsList>
            <div className="my-2 w-full border border-[#202020] max-md:my-[15px]"></div>
            <TabsContent
              value="send"
              className="flex flex-col gap-y-6 min-h-[250px]"
            >
              {/* <Send setIsLoading={setIsLoading} /> */}
              <SendNew setIsLoading={setIsLoading} />
            </TabsContent>
            <TabsContent value="receive" className="min-h-[250px]">
              {/* {!connected && (
                <div className="flex flex-col items-center justify-center px-6 py-6">
                  <img src="/receive.png" width={125} height={125} alt="logo" />
                  <h1 className="py-6 font-[Sregular] font-[400] text-white">
                    Nothing to withdraw yet!
                  </h1>
                  <h1 className="font-[Smono] text-[16px] text-[#414245]">
                    Keys Checked: <span className="text-white">0/0</span>
                  </h1>
                </div>
              )}
              {connected && (
                <div className="flex flex-col items-center justify-center gap-y-5 p-4 md:px-6 md:py-6">
                  <div className="flex w-full items-center justify-start gap-6 max-md:flex-col">
                    <div className="flex flex-wrap justify-start gap-4">
                      {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                        <button
                          key={item}
                          className={`flex font-[Sregular] justify-center gap-4 rounded-full p-3 px-4  ${
                            selectedButtonIndex === item
                              ? "bg-[#38E5FF] text-black"
                              : "bg-[#1B1C20] text-white"
                          }`}
                          onClick={() => handleButtonClick(item)}
                        >
                          0 ETH
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-start px-2 max-md:w-full">
                      <h1 className="font-[Sregular] text-[24px] text-[#414245]">
                        Keys Checked: <span className="text-white">7/7</span>
                      </h1>
                    </div>
                  </div>
                  <div className="flex w-full justify-start">
                    <h1 className="px-2 font-[Sregular] text-[24px] font-bold text-[#CECECE]">
                      Withdraw{" "}
                      <span className="font-[Sregular] font-bold text-white">
                        {selectedButtonIndex !== null ? selectedButtonIndex : 0}{" "}
                        ETH
                      </span>
                    </h1>
                  </div>
                  <div className="flex w-full gap-x-2 rounded-full bg-[#202227] px-[6px] py-2 md:gap-3 md:p-2 md:px-3">
                    <span className="flex w-[55%] items-center justify-center rounded-full bg-black px-0 py-[6px] font-[Nregular] text-white max-md:text-sm md:w-[10%] md:px-4 md:py-[6px]">
                      To Addres
                    </span>
                    <input
                      type="text"
                      className="focus:cursor w-[80%] bg-transparent font-[Sregular] text-white focus:outline-none"
                      placeholder="Enter receiving address"
                    />
                    <button className="rounded-full bg-transparent font-[Sregular] text-[#38E5FF] hover:bg-[#253038] max-md:hidden md:w-[15%]">
                      Use Connected Wallet
                    </button>
                  </div>
                  <button className="flex w-[90%] justify-start rounded-full bg-transparent font-[Sregular] text-[#38E5FF] hover:bg-[#253038] md:hidden md:w-[15%]">
                    Use Connected Wallet
                  </button>
                  <div className="flex w-full items-start justify-start gap-x-6 max-md:flex-col max-md:gap-y-3">
                    <button className="flex w-[20%] items-center justify-center gap-2 rounded-full bg-[#253038] py-2 font-[Smono] text-[#CAECF1] hover:bg-[#38e4ff8e] max-md:w-full">
                      Withdraw
                      <img src="/load.png" alt="logo" width={20} height={20} />
                    </button>
                    <button className="flex w-[20%] items-center justify-center gap-2 rounded-full border border-[#CAECF1] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#253038] max-md:w-full">
                      Copy Private Key
                      <img src="/copy.png" alt="logo" width={20} height={20} />
                    </button>
                  </div>
                </div>
              )} */}
              <Withdraw setIsLoading={setIsLoading} />
            </TabsContent>
            <TabsContent value="dataPool" className="min-h-[250px]">
              {/* <div className="flex flex-col items-center justify-center px-6 py-12">
                <img src="/Table.png" width={135} height={135} alt="logo" />
                <h1 className="font-[Nregular] font-[400] text-white">
                  Display Transaction History
                </h1>
              </div> */}
              <TransactionPool activeTab={true} />
            </TabsContent>
          </Tabs>
        </div>
      </AddressProvider>
    </section>
  );
};
export default Main;
