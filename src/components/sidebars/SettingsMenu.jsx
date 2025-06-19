import { MdOutlineManageAccounts } from "react-icons/md";
const SettingsMenu = () => {
  return (
    <div className="bg-green-500 w-50 h-full grid grid-cols-1 ">
      <div className=" h-64">
        <div className="bg-sky-400 flex justify-start items-center">
          <p className="border text-black text-lg">Account</p>
          <MdOutlineManageAccounts className="border h-full" />
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
