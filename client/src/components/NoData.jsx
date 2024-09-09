import { Tree } from "../lib/Svgs/Tree";

const NoData = ({ description }) => {
  return (
    <div className="text-center w-full mt-3 flex flex-col items-center justify-center text-gray-500">
      <Tree width={350} height={350} />
      <div className="text-3xl text-slate-400">{description}</div>
    </div>
  );
};

export default NoData;
