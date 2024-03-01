import React from "react";

export const FileUploader = ({
  preLoad,
  handleFile,
}: {
  preLoad: () => void;
  handleFile: (f: File) => void;
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    preLoad();
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex w-1/2 items-center justify-center gap-2 rounded-full bg-[#253038] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#38e4ff8e] max-md:w-full"
      >
        Load Key
        <img src="/load.png" alt="logo" className="w-[18px] h-[18px]" />
      </button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
};
