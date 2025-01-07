"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
type likeTypes = {
  _id: string;
  profileImage: string;
  username: string;
};
export const LikedUsersSection = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}) => {
  const [likedUsers, setLikedUsers] = useState<likeTypes[]>([]);
  const token = localStorage.getItem("accessToken");
  const getLikedUser = async () => {
    if (open === true) {
      const jsonData = await fetch(
        `https://instagram-server-8xvr.onrender.com/getLikedUserOfOnePost/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await jsonData.json();
      setLikedUsers(response.likes);
      console.log(response.likes);
    }
  };
  useEffect(() => {
    getLikedUser();
  }, [id]);
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent className="bg-black flex flex-col justify-start gap-5 text-white h-[500px]">
        <DialogHeader>
          <DialogTitle>
            {" "}
            <div className="flex">
              {" "}
              <Link href={`/posts`}>
                {" "}
                <ChevronLeft className="text-white" />
              </Link>
              <div className="italic text-xl bg-black text-white pl-6">
                Likes
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {likedUsers?.map((likedUser) => {
          return (
            <Card key={likedUser._id} className="bg-black border-none w-screen">
              <CardContent className="p-0 flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={likedUser.profileImage} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>{" "}
                <div className="text-white font-bold">{likedUser.username}</div>
              </CardContent>
            </Card>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};
