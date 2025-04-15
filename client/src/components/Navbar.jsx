import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
        <Image src="blog-logo.png" alt="Blog App Logo" w={42} h={42} />
        <span>Blog Logo</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">

        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {/* Change Hamburger Icon */}
          {/* {open ? "X" : "☰"} */}
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>

        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#FEFAEF] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
          <Link to="/posts" onClick={()=>setOpen(false)}>Trending</Link>
          <Link to="/posts" onClick={()=>setOpen(false)}>Most Popular</Link>
          <Link to="/" onClick={()=>setOpen(false)}>About</Link>
          <Link to="/login" onClick={()=>setOpen(false)}>
            <button className="py-2 px-4 rounded-3xl bg-[#391600] text-[#CCC9B4]">
              Login 👋
            </button>
          </Link>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/posts">Trending</Link>
        <Link to="/posts">Most Popular</Link>
        <Link to="/">About</Link>
        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-[#391600] text-[#CCC9B4]">
              Login
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;