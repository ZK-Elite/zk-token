import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Withdraw } from './withdraw'
import { supabase } from '../utils/constants';
import { AddressContextType } from './address';
import { useToast } from '@chakra-ui/react';
import { curve, ec as EC } from "elliptic";
import { BigNumber, ethers } from "ethers";
import { base58, getAddress, keccak256, parseEther } from "ethers/lib/utils.js";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { ZkmlPayABI } from "../contracts/abi.json";
import { registryAddress, explorer } from "../utils/constants";
import { calculateCrc } from "../utils/crc16";
import useDebounce from "../utils/debounce";
// import { Connect } from "./connect";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function withdrawNew({setIsLoading,connected}) {
    const ec = useMemo(() => {
        return new EC("secp256k1");
      }, []);
      const handleButtonClick = (index: number) => {
        setSelectedButtonIndex((prevIndex) => (prevIndex === index ? null : index));
      };
      const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(
        null
      );
    
    //   const { verxioPrivateKey } = useContext(AddressContext) as AddressContextType;
    //   const { spendingKey } = useContext(AddressContext) as AddressContextType;
    //   const [keyAddrs, setKeyAddrs] = useState<Array<string[]>>([]);
    //   const [modalVisible, setModalVisible] = useState<boolean>(false);
    //   const [active, setActive] = useState<any>({});
    //   const [targetAddr, setTargetAddr] = useState<string>("");
    //   const [isSending, setIsSending] = useState<boolean>(false);
    //   const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
    //   const [isCopied, setIsCopied] = useState<boolean>(false);
    //   const [withdrawSuccess, setWithdrawSuccess] = useState<string>();
    //   const [withdrawError, setWithdrawError] = useState<string>();
    //   const [txPending, setTxPending] = useState<string>("");
    //   const [keysCount, setKeysCount] = useState<number>(0);
    //   const [keysIndex, setKeysIndex] = useState<number>(0);
    
    //   const toast = useToast();
    //   const { chain } = useNetwork();
    //   const { isConnected, address } = useAccount();
    //   const registryConfig = {
    //     address: registryAddress[chain?.id || 100 || 10200],
    //     abi: ZkmlPayABI,
    //   };
    //   const explorerAddress = explorer[chain?.id || 100 || 10200];
    
    //   useEffect(() => {
    //     setKeyAddrs([]);
    //     setKeysIndex(0);
    //   }, [spendingKey, chain]);
    
    //   const { refetch: refetchKeys } = useContractRead({
    //     ...registryConfig,
    //     functionName: "getNextKeys",
    //     args: [keysIndex] as const,
    //     enabled: isConnected,
    //   });
    
    //   const { data: _keysCount, refetch: refetchKeysCount } = useContractRead({
    //     ...registryConfig,
    //     functionName: "totalKeys",
    //     enabled: isConnected,
    //   });
    
    //   const saveData = async (address: any) => {
    //     const date = new Date();
    //     const isoDateString = date.toISOString();
    
    //     await supabase.from("zkml").upsert([
    //       {
    //         zkmlid: verxioPrivateKey,
    //         type: "receive",
    //         address: address,
    //         amount: active?.balance,
    //         createtime: isoDateString,
    //         cryptotype: chain?.nativeCurrency.symbol,
    //         explorerAddress: explorerAddress,
    //       },
    //     ]);
    //   };
    
    //   useEffect(() => {
    //     if (!isConnected || !!!_keysCount) return;
    
    //     setKeysCount(Number(_keysCount) || 0);
    //     const handler = setInterval(() => {
    //       refetchKeysCount().then((x) => setKeysCount(Number(x.data)));
    //     }, 10000);
    
    //     return () => {
    //       clearInterval(handler);
    //     };
    //   }, [isConnected, chain, refetchKeysCount]);
    
    //   useEffect(() => {
    //     if (!keysCount || !spendingKey || !isConnected) return;
    
    //     // console.log('Effect keys, idx: ' + keysIndex);
    
    //     refetchKeys().then((x) => {
    //       findMatch(x.data as KeyObject[]).then(() => {
    //         if (keysCount > keysIndex) {
    //           // delay between sequential calls
    //           setTimeout(() => {
    //             setKeysIndex(Math.min(keysCount, keysIndex + 10));
    //           }, 750);
    //         }
    //       });
    //     });
    //   }, [keysCount, refetchKeys, isConnected, spendingKey, keysIndex, activeTab]);
    
    //   useEffect(() => {
    //     setTargetAddr("");
    //     setIsSending(false);
    //     setIsAddressValid(true);
    //     setWithdrawError(undefined);
    //     setWithdrawSuccess(undefined);
    //     setTxPending("");
    //   }, [modalVisible]);
    
    //   useEffect(() => {
    //     try {
    //       getAddress(targetAddr);
    //       setIsAddressValid(true);
    //     } catch (e) {
    //       setIsAddressValid(false);
    //     }
    //   }, [targetAddr]);
    
    //   interface KeyObject {
    //     x: string;
    //     y: string;
    //     ss: string;
    //     token: string;
    //   }
    
    //   const findMatch = async (keys: KeyObject[]) => {
    //     if (!spendingKey || !isConnected) return;
    
    //     const _addrs = await Promise.all(
    //       keys.map(async (key) => {
    //         const { x, y, ss, token } = key;
    //         const _x = parseInt(x, 16);
    //         const _y = parseInt(y, 16);
    //         if (_x === 0 || _y === 0) return null;
    
    //         let eph;
    //         try {
    //           eph = ec.keyFromPublic(`04${x.slice(2)}${y.slice(2)}`, "hex");
    //         } catch (e) {
    //           console.error("Error", e);
    //           return null;
    //         }
    
    //         const _ss = spendingKey.derive(eph.getPublic());
    
    //         // early check if shared secret might be the same
    //         if (_ss.toArray()[0] == parseInt(ss, 16)) return null;
    
    //         const hashed = ec.keyFromPrivate(keccak256(_ss.toArray()));
    //         // console.log(hashed)
    //         const pub = spendingKey
    //           .getPublic()
    //           .add(hashed.getPublic())
    //           .encode("array", false);
    
    //         const _addr = keccak256(pub.splice(1));
    //         const addr = getAddress(
    //           "0x" + _addr.substring(_addr.length - 40, _addr.length)
    //         );
    
    //         if (token === ethers.constants.AddressZero) {
    //           const bal = await fetchBalance({ address: `0x${addr.substring(2)}` });
    
    //           if (bal.formatted != "0") {
    //             return [x, y, token, bal.formatted, addr];
    //           }
    //         } else {
    //           console.error("Token transfers aren't supported yet");
    //         }
    
    //         return null;
    //       })
    //     );
    
    //     const addrs = _addrs.filter((_y) => _y !== null);
    //     // console.log('Found new keys: ' + addrs.length + ' from ' + keys.length);
    //     setKeyAddrs([...keyAddrs, ...(addrs as Array<string[]>)]);
    
    //     // console.log(addrs)
    //   };
    
    //   const buildPrivateKey = (x: string, y: string, spendingKey: EC.KeyPair) => {
    //     const eph = ec.keyFromPublic(`04${x.slice(2)}${y.slice(2)}`, "hex");
    
    //     const ss = spendingKey.derive(eph.getPublic());
    //     const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));
    
    //     const _key = spendingKey.getPrivate().add(hashed.getPrivate());
    //     const key = _key.mod(ec.curve.n);
    
    //     return key;
    //   };
    
    //   const withdraw = async (
    //     x: string,
    //     y: string,
    //     // token: string,
    //     addr: `0x${string}`,
    //     target: `0x${string}`
    //   ) => {
    //     if (!spendingKey) return;
    //     let receiveaddress;
    //     setIsSending(true);
    //     setIsLoading(true);
    //     const bal = await fetchBalance({ address: addr });
    //     const key = buildPrivateKey(x, y, spendingKey);
    //     // Prepare the transaction
    //     let request = await prepareSendTransaction({
    //       to: target,
    //       // value: parseEther(bal.formatted) ,
    //     });
    
    //     try {
    //       const provider = new StaticJsonRpcProvider(chain?.rpcUrls.public.http[0]);
    //       const signer = new ethers.Wallet(key.toArray(undefined, 32), provider);
    
    //       let gasLimit = request.gas!;
    //       const feeData = await fetchFeeData();
    //       const gasPrice = feeData.gasPrice!;
    
    //       let fee = gasLimit * gasPrice;
    //       const originalBalance = parseEther(bal.formatted);
    
    //       const sendValue = originalBalance - fee;
    //       const result = await signer.sendTransaction({
    //         to: target,
    //         value: sendValue,
    //         gasPrice: gasPrice,
    //       });
    
    //       setTxPending(result.hash);
    //       const data = await waitForTransaction({
    //         hash: result.hash as `0x${string}`,
    //       });
    
    //       setTxPending("");
    //       setWithdrawSuccess(data.transactionHash);
    //       receiveaddress = data.transactionHash;
    //       // exclude address from the list
    //       setKeyAddrs(keyAddrs.filter((p) => p[4] !== addr));
    //     } catch (e) {
    //       setWithdrawError((e as Error).message);
    //       setTxPending("");
    //     }
    //     saveData(receiveaddress);
    //     setIsSending(false);
    //   };
    
    //   useEffect(() => {
    //     setIsLoading(isSending);
    //   }, [isSending]);
    
    //   useEffect(() => {
    //     if (withdrawError) {
    //       toast({
    //         title: "Transaction Warning",
    //         description: withdrawError.slice(0, 40) + "...",
    //         status: "warning", // success, error, warning, info
    //         duration: 5000, // Duration in milliseconds
    //         isClosable: true, // Whether the toast is closable by user
    //         position: "top-right",
    //       });
    //     }
    //     if (withdrawSuccess) {
    //       toast({
    //         title: "Transaction Success",
    //         description: "Celbrate! You have successfully withdrawn your funds.",
    //         status: "success", // success, error, warning, info
    //         duration: 5000, // Duration in milliseconds
    //         isClosable: true, // Whether the toast is closable by user
    //         position: "top-right",
    //       });
    //     }
    //   }, [withdrawError, withdrawSuccess]);
  return (
    <>
    {!connected && (
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
              )}
              <Withdraw setIsLoading={setIsLoading} />
</>
  )
}

export default withdrawNew