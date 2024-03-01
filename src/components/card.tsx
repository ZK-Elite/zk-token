type Props = {
  name: string;
  desc: string;
  b1txt: string;
  b2txt: string;
  icon1: string;
  icon2: string;
  note: string;
};

const Card = ({ name, desc, b1txt, b2txt, icon1, icon2, note }: Props) => {
  return (
    <div className="flex w-full flex-col gap-y-12 rounded-2xl border border-[#242428] bg-[#14161A] p-6 md:h-[216px] md:w-[50%]">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-1 font-[Sbold] text-[20px] text-[#CAECF1]">
          {note && <img src={note} alt="Note" className="h-5 w-5" />}
          {name}
        </div>
        <div className="text-[18px] text-[#FFF]">
          <h1 className="break-words font-[Sregular]">{desc}</h1>
        </div>
      </div>
      <div className="flex items-center gap-x-6 max-md:flex-col max-md:gap-y-3">
        <button className="flex w-1/2 items-center justify-center gap-2 rounded-full bg-[#253038] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#38e4ff8e] max-md:w-full">
          {b1txt}
          <img src={icon1} alt="logo" className="w-[18px] h-[18px]" />
        </button>
        <button className="flex w-1/2 items-center justify-center gap-2 rounded-full border border-[#CAECF1] py-2 font-[Nregular] text-[#CAECF1] hover:bg-[#253038] max-md:w-full">
          {b2txt}
          <img src={icon2} alt="logo" className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default Card;
