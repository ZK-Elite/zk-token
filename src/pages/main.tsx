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
import WithdrawNew from "../components/withdrawNew";

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const connected = false;

  

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

              <WithdrawNew  setIsLoading={setIsLoading} connected={connected}  />
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
