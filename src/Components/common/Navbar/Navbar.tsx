import { useDispatch } from "react-redux";
import Search from "../Search";
import { GiHamburgerMenu } from "react-icons/gi";
import { SetSideBarOpen } from "../../../store/slice/uiSlice";
import ThemeSwitch from "./ThemeSwitch";
import ProfileHandler from "./ProfileHandler";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 bg-transparent flex items-center justify-between px-2 md:px-6 py-4">
      <div className="flex items-center gap-2">
        <button
          className="flex md:hidden cursor-pointer rounded-xl p-2 hover:bg-white z-50 mr-2
           bg-zinc-100 
           dark:bg-[hsl(0,0%,5%)] dark:hover:bg-[hsl(0,0%,10%)]
           dark-island:bg-[hsl(0,0%,5%)] dark-island:hover:bg-[hsl(0,0%,10%)] 
           pitch-black:bg-[hsl(0,0%,5%)] pitch-black:hover:bg-[hsl(0,0%,10%)] 
            "
          onClick={() => dispatch(SetSideBarOpen())}
        >
          <GiHamburgerMenu />
        </button>
        <h3 className="hidden md:flex text-3xl font-bold note-accent-gradient">
          Note
        </h3>
      </div>

      <Search />

      <div className="flex items-center gap-3">
        <ThemeSwitch/>
        <ProfileHandler/>
      </div>
    </header>
  );
};

export default Navbar;
