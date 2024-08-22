"use client";
import { FaInstagram } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { TbBrandTiktok } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="p-2 text-black w-full relative">
      <div className="flex flex-col items-center justify-center text-xs ">
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/repositionglobal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={18} />
          </a>
          <p>|</p>
          <a
            href="mailto:welcome@re-position.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdMailOutline size={19} />
          </a>
          <p>|</p>
          <a
            href="https://www.tiktok.com/@repositionglobal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TbBrandTiktok size={18} />
          </a>
          <p>|</p>
          <a
            href="https://twitter.com/repositionglo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter size={17} />
          </a>
        </div>
        <span className="text-[10px] mt-1">
          © {currentYear} Reposition global, Inc.{" "}
        </span>
      </div>
    </div>
  );
};

export default Footer;
