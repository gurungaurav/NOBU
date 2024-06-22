import hyaat from "../../assets/hyatt.png";
import hyaat_ktm from "../../assets/hyaat_ktm.png";

export default function HotelsMembers() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 my-20">
      <div className="">
        <h1 className="text-3xl font-semibold">Nobu is a member of the Nobu Group marketplace of travel brands</h1>
      </div>
      <div className="flex items-center justify-between gap-4">
        <img className="h-20 w-20 grayscale-[100%] hover:grayscale-0 cursor-pointer ease-in duration-300" src={hyaat}></img>
        <img className="h-20 w-20 grayscale-[100%] hover:grayscale-0 cursor-pointer ease-in duration-300 object-cover" src={hyaat_ktm}></img>
        <img className="h-20 w-20 grayscale-[100%] hover:grayscale-0 cursor-pointer ease-in duration-300" src={hyaat}></img>
        <img className="h-20 w-20 grayscale-[100%] hover:grayscale-0 cursor-pointer ease-in duration-300 object-cover" src={hyaat_ktm}></img>
        <img className="h-20 w-20 grayscale-[100%] hover:grayscale-0 cursor-pointer ease-in duration-300" src={hyaat}></img>
        <img className="h-20 w-20 grayscale-[100%] hover:grayscale-0 cursor-pointer ease-in duration-300 object-cover" src={hyaat_ktm}></img>
      </div>
    </div>
  );
}
