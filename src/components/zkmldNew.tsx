/* eslint-disable @typescript-eslint/no-unused-vars */
import { ec as EC } from "elliptic";
import { useCallback, useContext, useEffect, useState } from "react";
import { faCopy, faSave } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { base58 } from "ethers/lib/utils.js";
import { copyTextToClipboard } from "../utils/clipboard";
import { calculateCrc } from "../utils/crc16";
import { downloadTxtFile } from "../utils/download";
import { useLocalStorage } from "../utils/localstorage";
import { AddressContext, AddressContextType } from "./address";
import { FileUploader } from "./upload";
import "./zkmlid.css";
import ZkmlIdBg from "../assets/svg/ZkmlidBg.svg";
import ZkmlHeader from "../assets/svg/ZkmlHeader.svg";
import EllipseEffect from "../assets/svg/Ellipse.svg";
import { Tooltip } from "@chakra-ui/react";
import Card from "./card";

const Zkmlid = () => {
  const ec = new EC("secp256k1");

  const { spendingKey, setSpendingKey, setVerxioPrivateKey } = useContext(
    AddressContext
  ) as AddressContextType;

  const [metaAddr, setMetaAddr] = useState<string>();
  const [copied, setCopied] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [loadSuccess, setLoadSuccess] = useState<boolean>(false);
  const [keySaved, setKeySaved] = useState<boolean>(true);

  const [storedSpendingKey, setStoredSpendingKey] = useLocalStorage<
    string | null
  >("spendingKey", null);

  const generateNewKey = () => {
    const key = ec.genKeyPair();
    setSpendingKey(key);
    setStoredSpendingKey(key.getPrivate().toString(16));
    setKeySaved(false);
    setLoadError(false);
  };

  useEffect(() => {
    let skey;

    if (storedSpendingKey) {
      try {
        skey = ec.keyFromPrivate(storedSpendingKey, "hex");
        setSpendingKey(skey);
        setVerxioPrivateKey(metaAddr);
      } catch (e) {
        console.log(e);
      }
    }
    if (!skey) {
      generateNewKey();
    }
  }, [storedSpendingKey]);

  useEffect(() => {
    if (!spendingKey) return;

    const data = Uint8Array.from(
      spendingKey.getPublic().encodeCompressed("array")
    );
    const crc = calculateCrc(data);

    const addr = new Uint8Array(data.length + 2);
    addr.set(data);
    addr.set(crc, data.length);

    setMetaAddr("V" + base58.encode(addr));
    setVerxioPrivateKey("V" + base58.encode(addr));
  }, [spendingKey]);

  const handleFile = async (f: File) => {
    if (!f) return;

    if (f.size !== 64) {
      setLoadError(true);
      return;
    }

    try {
      const key = await f.text();
      const skey = ec.keyFromPrivate(key, "hex");

      setVerxioPrivateKey(metaAddr);
      setSpendingKey(skey);
      setStoredSpendingKey(key);

      setLoadSuccess(true);
      setKeySaved(true);

      setTimeout(() => {
        setLoadSuccess(false);
      }, 1500);
    } catch (e) {
      setLoadError(true);
      console.log(e);
    }
  };

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      copyTextToClipboard(metaAddr ? `${metaAddr}` : "").then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      });
    },
    [metaAddr]
  );

  return (
    <div className="flex items-center justify-between gap-8 max-md:flex-col">
      <div className="flex w-full flex-col gap-y-12 rounded-2xl border border-[#242428] bg-[#14161A] p-6 md:h-[216px] md:w-[50%]">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1 font-[Sbold] text-[20px] text-[#CAECF1]">
            ZKML ID
          </div>
          <div className="text-[18px] text-[#FFF]">
            <h1 className="break-words font-[Sregular]">{metaAddr}</h1>
          </div>
        </div>
        <div className="flex items-center gap-x-6 max-md:flex-col max-md:gap-y-3">
          <button
            className="flex w-1/2 items-center justify-center gap-2 rounded-full bg-[#253038] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#38e4ff8e] max-md:w-full"
            title="Copy link"
            onClick={handleCopy}
          >
            Copy
            <img src="/copy.png" alt="logo" className="w-[18px] h-[18px]" />
          </button>
          <button
            className="flex w-1/2 items-center justify-center gap-2 rounded-full border border-[#CAECF1] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#253038] max-md:w-full"
            title="Generate new"
            onClick={generateNewKey}
          >
            Generate New
            <img src="/generate.png" alt="logo" className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-12 rounded-2xl border border-[#242428] bg-[#14161A] p-6 md:h-[216px] md:w-[50%]">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-1 font-[Sbold] text-[20px] text-[#CAECF1]">
            <img src="/note.png" alt="Note" className="h-5 w-5" />
            Note
          </div>
          <div className="text-[18px] text-[#FFF]">
            <h1 className="break-words font-[Sregular]">
              After you've shared your ID, make sure to save its key. You'll
              need the key to withdraw funds. Remember, only share the ID, not
              the key.
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-x-6 max-md:flex-col max-md:gap-y-3">
          <FileUploader
            preLoad={() => {
              setLoadError(false);
              setLoadSuccess(false);
            }}
            handleFile={handleFile}
          />

          {spendingKey && (
            <button
              className="flex w-1/2 items-center justify-center gap-2 rounded-full border border-[#CAECF1] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#253038] max-md:w-full"
              onClick={() => {
                downloadTxtFile(
                  spendingKey.getPrivate().toString(16),
                  `Zkml_${metaAddr}.txt`
                )();
                setKeySaved(true);
              }}
              disabled={!spendingKey}
            >
              Save Key
              <img src="/save.png" alt="logo" className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Zkmlid;
