import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
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
import { supabase } from "../utils/constants";

import "./panes.css";

const zero = BigNumber.from(0);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SendNew(props: any) {
  const ec = useMemo(() => {
    return new EC("secp256k1");
  }, []);

  const { chain } = useNetwork();
  const { setIsLoading } = props;
  const explorerAddress = explorer[chain?.id || 100 || 10200];
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
    cacheTime: 3_500,
  });

  const [xdcAddr, setxdcAddr] = useState<string>(ethers.constants.AddressZero);
  const [sharedSecretByte, setSharedSecretByte] = useState<string>("0x00");
  const [theirID, setTheirID] = useState<string>("");
  const [ephPublic, setEphPublic] = useState<curve.base.BasePoint>();
  const [ZkmlIDError, setZkmlIDError] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [amountWei, setAmountWei] = useState<BigNumber>(zero);
  const [hash] = useState<string>(window.location.hash);
  const toast = useToast();

  const debouncedAmount = useDebounce(amountWei, 500);
  const debouncedAddr = useDebounce(xdcAddr, 500);

  const {
    isError: isPrepareError,
    error: prepareError,
    config,
  } = usePrepareContractWrite({
    address: registryAddress[chain?.id || 0],
    abi: ZkmlPayABI,
    functionName: "publishAndSend",
    args: [
      "0x" + ephPublic?.getX().toString(16, 64),
      "0x" + ephPublic?.getY().toString(16, 64),
      "0x" + sharedSecretByte,
      debouncedAddr,
    ],
    value: debouncedAmount.toBigInt(),
    enabled: debouncedAmount.gt(zero),
  });

  const { data, isError, error, write, reset } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleIDInput = (ev: React.FormEvent<HTMLInputElement>) => {
    setTheirID(ev.currentTarget.value);
    setZkmlIDError(false);
    reset();
  };

  const handleAmountInput = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    setAmount(event.currentTarget.value);
    setAmountError(false);
  };

  const generateNewEphKey = useCallback(() => {
    if (!theirID) return;

    if (theirID.at(0) !== "V") {
      setZkmlIDError(true);
      return;
    }

    const _theirID = theirID.slice(1);
    let decodedID: Uint8Array;
    try {
      decodedID = base58.decode(_theirID);
    } catch (e) {
      console.log("Invalid base58 encoding");
      setZkmlIDError(true);
      return;
    }

    if (decodedID.length !== 35) {
      setZkmlIDError(true);
      return;
    }

    const trueID = decodedID.subarray(0, 33);
    const crc = calculateCrc(trueID);
    if (!crc.every((x, idx) => x === decodedID[33 + idx])) {
      console.log("CRC error: " + crc + "; " + decodedID);
      setZkmlIDError(true);
      return;
    }

    try {
      const meta = ec.keyFromPublic(trueID, "hex");

      // generate eph key
      const ephKey = ec.genKeyPair();
      setEphPublic(ephKey.getPublic());

      const ss = ephKey.derive(meta.getPublic());

      const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));
      const pub = meta
        .getPublic()
        .add(hashed.getPublic())
        .encode("array", false);

      const addr = keccak256(pub.splice(1));

      setxdcAddr(
        getAddress("0x" + addr.substring(addr.length - 40, addr.length))
      );

      setSharedSecretByte(ss.toArray()[0].toString(16).padStart(2, "0"));

      console.log(
        `Current ephemeral pubkey: ${ephKey.getPublic().encode("hex", true)}`
      );
    } catch (e) {
      setZkmlIDError(true);
    }
  }, [theirID, ec]);

  const saveData = async () => {
    const date = new Date();
    const isoDateString = date.toISOString();

    await supabase.from("zkml").upsert([
      {
        zkmlid: theirID,
        type: "send",
        address: data?.hash,
        amount: amount,
        createtime: isoDateString,
        cryptotype: chain?.nativeCurrency.symbol,
        explorerAddress: explorerAddress,
      },
    ]);
  };

  useEffect(() => {
    if (!theirID) {
      setZkmlIDError(true);
      return;
    }

    if (theirID.startsWith("https://zkml/#")) {
      setTheirID(theirID.replace("https://zkml/#", ""));
    } else {
      generateNewEphKey();
    }
  }, [theirID, generateNewEphKey]);

  useEffect(() => {
    generateNewEphKey();
    if (isSuccess) {
      toast({
        title: "Success Transaction",
        description: "You can withdraw funds by use key",
        status: "success", // success, error, warning, info
        duration: 5000, // Duration in milliseconds
        isClosable: true, // Whether the toast is closable by user
        position: "top-right",
      });
      saveData();
    }
    setIsLoading(isLoading);
  }, [isSuccess, isLoading]);

  useEffect(() => {
    if (isPrepareError) {
      toast({
        title: "Transaction Failed",
        description: prepareError?.message.slice(0, 40) + "...",
        status: "error", // success, error, warning, info
        duration: 5000, // Duration in milliseconds
        isClosable: true, // Whether the toast is closable by user
        position: "top-right",
      });
    }
    if (isError) {
      toast({
        title: "Transaction Failed",
        description: error?.message.slice(0, 40) + "...",
        status: "error", // success, error, warning, info
        duration: 5000, // Duration in milliseconds
        isClosable: true, // Whether the toast is closable by user
        position: "top-right",
      });
    }
  }, [isPrepareError, isError]);

  useEffect(() => {
    if (hash.length > 20) {
      setTheirID(hash.slice(1));
    }
  }, [hash]);

  useEffect(() => {
    try {
      const _amount = parseEther(amount);
      setAmountWei(_amount);

      if (balance) {
        if (_amount.gte(balance.value)) {
          setAmountError(true);
        }
      }
    } catch (e) {
      setAmountError(true);
    }
  }, [amount, balance]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="font-[Sregular] text-[22px] leading-8 text-white max-md:text-[18px]">
        {chain?.nativeCurrency.symbol || "Crypto"} will be sent to a secret
        blockchain account that will hold the{" "}
        {chain?.nativeCurrency.symbol || "crypto"} temporarily. The user who
        owns the ZKML ID will have control over the secret account.
      </div>
      <form
        onSubmit={() => {
          return false;
        }}
      >
        <div className="flex w-full gap-3 rounded-full bg-[#202227] px-[6px] py-2 md:p-2 md:px-3">
          <label
            htmlFor="xcryptID"
            className="flex w-[45%] items-center justify-center rounded-full bg-black px-0 py-2 font-[Sregular] text-white max-md:text-sm md:w-[10%] md:px-4 md:py-[6px]"
          >
            ZKML ID
          </label>
          <input
            type="text"
            id="xcryptID"
            value={theirID}
            disabled={!isConnected || isLoading}
            spellCheck="false"
            autoComplete="off"
            className="focus:cursor w-full bg-transparent font-[Sregular] text-white focus:outline-none"
            placeholder="Enter receiver ZKML ID "
            onChange={handleIDInput}
          />
        </div>
      </form>
      {isConnected && balance && (
        <>
          <form className="flex flex-col gap-5">
            <div className="flex w-full flex-col gap-y-2">
              <div className="flex w-full gap-3 rounded-full bg-[#202227] px-[6px] py-2 md:p-2 md:px-3">
                <span className="flex w-[55%] items-center justify-center rounded-full bg-black px-0 py-2 font-[Sregular] text-white max-md:text-sm md:w-[10%] md:px-4 md:py-[6px]">
                  Amount ({chain?.nativeCurrency.symbol})
                </span>
                <input
                  type="text"
                  className={`focus:cursor w-[80%] bg-transparent font-[Sregular] text-white focus:outline-none  ${
                    amountError ? "error-input" : ""
                  }`}
                  placeholder="0.00"
                  value={amount}
                  autoComplete="off"
                  id="amount"
                  disabled={isLoading}
                  onChange={handleAmountInput}
                />
              </div>
            </div>
            <div className="flex max-md:flex-col max-md:gap-y-2 md:justify-between">
              <div className="flex items-center gap-x-6 max-md:justify-center">
                <h1 className="font-[Sregular] text-[24px] text-white md:text-[30px]">
                  {Number(balance.formatted).toFixed(4)}{" "}
                  {chain?.nativeCurrency.symbol}
                </h1>
                <h1 className="font-[Sregular] text-[24px] text-[#4F5054]">
                  available
                </h1>
              </div>
              <div className="max-md:flex max-md:justify-center">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#38E5FF] py-2 font-[Sregular] text-[20px] font-bold text-black hover:bg-[#253038] hover:text-[#CAECF1] md:w-[20dvw]"
                  color="success"
                  disabled={!write || isLoading || amountError || ZkmlIDError}
                  onClick={(e) => {
                    e.preventDefault();
                    write?.();
                  }}
                >
                  {isLoading
                    ? "Sending..."
                    : `Send ${chain?.nativeCurrency.symbol}`}
                </button>
              </div>
            </div>
          </form>
          {theirID && ZkmlIDError && (
            <div className="lane">
              <p className="message error text-red-500">Invalid Zkml ID</p>
            </div>
          )}
          {isSuccess && !isError && !isPrepareError && (
            <div className="lane">
              <p className="message">
                <strong style={{ color: "#38E5FF" }}>Successfully sent!</strong>
                &nbsp;
                <a
                  href={`https://${explorerAddress}/tx/${data?.hash}`}
                  className="link-text"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on {chain?.name.split(" ")[0]} Explorer{" "}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    transform={{ rotate: -45 }}
                  />
                </a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
