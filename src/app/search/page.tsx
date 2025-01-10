"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { UserRoundSearch } from "lucide-react";
import Footer from "../components/Footer";
type User = {
  _id: string;
  username: string;
  profileImage: string;
};
const Search = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window.localStorage !== "undefined") {
      const storageToken = localStorage.getItem("accessToken") ?? "";
      setToken(storageToken);
    }
  }, []);

  const getUsers = async () => {
    const jsonData = await fetch(
      "https://instagram-server-8xvr.onrender.com/users",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setUsers(response);
  };

  const filteredUsers = users.filter((user) => {
    return user.username.includes(input);
  });
  return (
    <div className="bg-black w-screen h-screen flex flex-col gap-2 items-center">
      <div className="w-4/5 flex justify-between items-center">
        <Input
          placeholder="Search"
          className="text-white border-none px-2"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <UserRoundSearch
          className="text-white"
          onClick={() => {
            getUsers();
          }}
        />
      </div>
      {filteredUsers?.map((user) => {
        return (
          <Card
            key={user._id}
            className="bg-black border-none w-5/6 px-2"
            onClick={() => {
              router.replace(`/profile/${user._id}`);
            }}
          >
            <CardContent className="p-0 flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.profileImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-white font-bold">{user.username}</div>
            </CardContent>
          </Card>
        );
      })}
      <Footer />
    </div>
  );
};
export default Search;
