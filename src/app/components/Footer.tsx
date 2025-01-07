"use client";
import { jwtDecode } from "jwt-decode";
import { House } from "lucide-react";
import { Search } from "lucide-react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
type tokenType = { userId: string; username: string };
const Footer = () => {
  const router = useRouter();
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const { userId } = decodedToken;
  return (
    <div className="bg-black fixed bottom-0">
      <div className="flex justify-around w-screen">
        <House
          className="text-white"
          onClick={() => {
            router.replace("/posts");
          }}
        />
        <Search
          className="text-white"
          onClick={() => {
            router.replace("/search");
          }}
        />
        <User
          className="text-white"
          onClick={() => router.push(`/profile/${userId}`)}
        />
      </div>
    </div>
  );
};
export default Footer;
