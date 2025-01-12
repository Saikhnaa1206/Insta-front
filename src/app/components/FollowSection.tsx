"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

type userType = {
  _id: "";
  username: "";
  profileImage: "";
};
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
type tokenType = { userId: string; username: string };
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
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const accountId = decodedToken.userId;
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
      console.log(response);
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
  const deleteOneFollower = async (id: string) => {
    const body = {
      userId: accountId,
      deletingUserId: id,
    };
    await fetch(" https://instagram-server-8xvr.onrender.com/removeOneUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  };
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent className="bg-black flex flex-col justify-start gap-5 text-white h-[500px] w-">
        <DialogTitle>{username}</DialogTitle>
        <Carousel>
          <CarouselContent>
            <CarouselItem className="px-6 w-full flex flex-col gap-2 ">
              {" "}
              <div className="w-screen">Followers</div>
              {followers?.map((follower: userType) => {
                return (
                  <Card
                    key={follower._id}
                    className="bg-black border-none w-full"
                  >
                    {accountId === userId ? (
                      <div className="flex justify-between items-center">
                        <CardContent
                          className="p-0 flex items-center gap-2"
                          onClick={() => {
                            router.push(`/profile/${follower._id}`);
                          }}
                        >
                          <Avatar>
                            <AvatarImage src={follower.profileImage} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>{" "}
                          <div className="text-white font-bold">
                            {follower.username}
                          </div>
                        </CardContent>
                        <X
                          className="text-white"
                          onClick={() => {
                            deleteOneFollower(follower._id);
                          }}
                        />
                      </div>
                    ) : (
                      <CardContent className="p-0 flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={follower.profileImage} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>{" "}
                        <div className="text-white font-bold">
                          {follower.username}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </CarouselItem>
            <CarouselItem className="px-6 w-full flex flex-col gap-2">
              {" "}
              <div className="w-screen">Following</div>
              {following?.map((following: userType) => {
                return (
                  <Card
                    key={following._id}
                    className="bg-black border-none w-screen"
                    onClick={() => {
                      router.push(`/profile/${following._id}`);
                    }}
                  >
                    <CardContent className="p-0 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={following.profileImage} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>{" "}
                      <div className="text-white font-bold">
                        {following.username}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
