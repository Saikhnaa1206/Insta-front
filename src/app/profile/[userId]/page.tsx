"use client";
import { jwtDecode } from "jwt-decode";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { FollowSection } from "@/app/components/FollowSection";
type tokenType = { userId: string; username: string };

type User = {
  _id: string;
  username: string;
  profileImage: string;
};
type Comment = {
  _id: string;
  comment: string;
  userId: string;
  postId: string;
};
type postType = {
  _id: string;
  caption: string;
  postImage: string[];
  userId: User;
  likes: string[];
  comments: Comment[];
};
type userType = {
  _id: string;
  username: string;
  posts: postType[];
  followers: string[];
  following: string[];
  profileImage: string;
  bio: string;
};
const Profile = () => {
  const [account, setAccount] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const accountId = decodedToken.userId;
  const { userId } = useParams();
  const [user, setUser] = useState<userType>();
  const followedOrNot = user?.followers.includes(accountId);
  const getUser = async () => {
    if (accountId === userId) {
      setAccount(true);
    }
    const jsonData = await fetch(
      `https://instagram-server-8xvr.onrender.com/getAllOfOneUser/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setUser(response);
    console.log(response);
  };
  const followUser = async () => {
    if (followedOrNot) {
      const body = {
        unfollowingUserId: userId,
        userId: accountId,
      };
      await fetch(" https://instagram-server-8xvr.onrender.com/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } else {
      const body = {
        followingUserId: userId,
        userId: accountId,
      };
      await fetch(" https://instagram-server-8xvr.onrender.com/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    }
  };
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      getUser();
    }
  }, []);

  return (
    <div className="bg-black flex flex-col w-screen h-screen relative ">
      <FollowSection
        open={open}
        setOpen={setOpen}
        userId={user?._id as string}
        username={user?.username as string}
      />
      <div className="flex justify-between p-6 ">
        <div className="text-xl font-bold text-white">{user?.username}</div>
        {account === true ? (
          <SquarePlus
            className="text-white"
            onClick={() => router.replace("/writePost")}
          />
        ) : null}
      </div>
      <div className="flex items-center justify-around text-white">
        <div className="flex gap-2 items-center ">
          <Avatar className="h-[100px] w-[100px]">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          {user?.posts.length} <br /> posts
        </div>
        <div
          onClick={() => {
            setOpen(true);
          }}
        >
          {user?.followers.length} <br /> followers
        </div>
        <div
          onClick={() => {
            setOpen(true);
          }}
        >
          {user?.following.length} <br /> following
        </div>
      </div>
      <div className="font-bold text-white flex justify-between px-6">
        {user?.username}
      </div>
      <div className=" text-white flex justify-between px-6 ">{user?.bio}</div>
      <div className="flex justify-center">
        {" "}
        {account === false ? (
          <Button
            className="w-3/5"
            onClick={() => {
              followUser();
            }}
          >
            {followedOrNot ? "unfollow" : "follow"}
          </Button>
        ) : null}
      </div>
      <div className="width-full flex flex-wrap">
        {" "}
        {user?.posts.map((post) => {
          return (
            <img
              key={post._id}
              src={post.postImage[0]}
              className="w-1/3 h-[130px] bg-no-repeat bg-cover bg-center "
              onClick={() => {
                router.replace(`/posts/${userId}/${post._id}`);
              }}
            />
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
