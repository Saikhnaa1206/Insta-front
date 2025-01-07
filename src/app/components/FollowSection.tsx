"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
type userType = {
  _id: "";
  username: "";
  profileImage: "";
};
import { Carousel, CarouselContent } from "@/components/ui/carousel";
export const FollowSection = ({
  open,
  setOpen,
  userId,
  username,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
  username: string;
}) => {
  const token = localStorage.getItem("accessToken");
  const [followers, setFollowers] = useState<userType[]>([]);
  const [following, setFollowing] = useState<userType[]>([]);
  const getFollowers = async () => {
    if (userId) {
      const jsonData = await fetch(
        `https://instagram-server-8xvr.onrender.com/getFollowedUsersOfOneUser/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await jsonData.json();
      setFollowers(response);
    }
  };
  const getFollowing = async () => {
    if (userId) {
      const jsonData = await fetch(
        `https://instagram-server-8xvr.onrender.com/getFollowingUsersOfOneUser/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await jsonData.json();
      setFollowing(response);
    }
  };
  useEffect(() => {
    getFollowers();
    getFollowing();
  }, [userId]);
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent className="bg-black flex flex-col justify-start gap-5 text-white h-[500px]">
        <DialogTitle>{username}</DialogTitle>
        <Carousel>
          <CarouselContent>
            <div className="px-6 w-full flex flex-col gap-2">
              Followers
              {followers?.map((follower) => {
                return (
                  <Card
                    key={follower._id}
                    className="bg-black border-none w-screen"
                  >
                    <CardContent className="p-0 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={follower.profileImage} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>{" "}
                      <div className="text-white font-bold">
                        {follower.username}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="px-6 w-full flex flex-col gap-2">
              Following
              {following?.map((follower) => {
                return (
                  <Card
                    key={follower._id}
                    className="bg-black border-none w-screen"
                  >
                    <CardContent className="p-0 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={follower.profileImage} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>{" "}
                      <div className="text-white font-bold">
                        {follower.username}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
