"use client";

import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type tokenType = { userId: string; username: string };
type userType = {
  username: string;
  profileImage: string;
  bio: string;
};
const Page = () => {
  const router = useRouter();
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const accountId = decodedToken.userId;
  const [user, setUser] = useState<userType>();
  const getUser = async () => {
    const jsonData = await fetch(
      `https://instagram-server-8xvr.onrender.com/getAllOfOneUser/${accountId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setUser(response);
  };
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      getUser();
    }
  }, []);
  return (
    <div className="bg-black w-screen h-screen flex flex-col">
      <div className="flex">
        {" "}
        <ChevronLeft
          className="text-white"
          onClick={() => {
            router.replace(`/profile/${accountId}`);
          }}
        />
        <div className="italic text-xl bg-black text-white pl-6">Likes</div>
      </div>
      <div>
        <Input placeholder="Username" />
      </div>
    </div>
  );
};
export default Page;
