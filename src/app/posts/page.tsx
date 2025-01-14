"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LikedUsersSection } from "../components/LikedUsersSection";
import PostFooter from "../components/PostFooter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleArrowUp, EllipsisVertical } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
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
}[];
type tokenType = { userId: string; username: string };

const Page = () => {
  const [posts, setPosts] = useState<postType>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const [captionValue, setCaptionValue] = useState<string>("");
  const router = useRouter();
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const accountId = decodedToken.userId;
  const deletePost = async (postId: string) => {
    const body = {
      accountId,
      postId,
    };
    await fetch(" https://instagram-server-8xvr.onrender.com/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  };
  const editCaption = async () => {
    const body = {
      caption: captionValue,
      postId,
    };
    await fetch(" https://instagram-server-8xvr.onrender.com/captionEdit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  };
  const getPosts = async () => {
    const jsonData = await fetch(
      "https://instagram-server-8xvr.onrender.com/posts",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setPosts(response);
  };
  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      getPosts();
    }
  }, []);

  return (
    <div className="bg-black flex flex-col justify-start w-screen h-screen relative">
      <LikedUsersSection open={open} setOpen={setOpen} id={postId} />

      <div className=" text-xl bg-black text-white pl-6">𝓘𝓷𝓼𝓽𝓪𝓰𝓻𝓪𝓶</div>
      <div className="flex flex-col justify-center items-center gap-10 bg-black">
        {" "}
        {posts?.map((post) => {
          return (
            <div key={post._id} className="w-full">
              <Card
                key={post._id}
                className=" flex flex-col justify-center  text-xl bg-black border-none"
              >
                <CardHeader>
                  <div className="flex justify-between items-center w-full">
                    {" "}
                    <div
                      className="flex gap-2 items-center "
                      onClick={() => router.push(`/profile/${post.userId._id}`)}
                    >
                      <Avatar>
                        <AvatarImage src={post.userId.profileImage} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="text-white">{post.userId.username}</div>
                    </div>
                    {accountId === post.userId._id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {" "}
                          <EllipsisVertical className="text-white" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              deletePost(post._id);
                            }}
                          >
                            Delete post
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEdit(true);
                              setCaptionValue(post?.caption);
                              setPostId(post._id);
                            }}
                          >
                            Edit caption
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <EllipsisVertical className="text-white" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Carousel>
                    <CarouselContent>
                      {post.postImage?.map((image, index) => {
                        return (
                          <CarouselItem key={index}>
                            <img src={image} className="w-full" />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </Carousel>
                </CardContent>
                {edit === true &&
                postId === post._id &&
                accountId === post.userId._id ? (
                  <CardDescription className="flex p-6 justify-between items-center">
                    <Input
                      className="font-black text-white border-none"
                      value={captionValue}
                      onChange={(e) => {
                        setCaptionValue(e.target.value);
                      }}
                    />
                    <CircleArrowUp
                      className="text-white"
                      onClick={() => {
                        editCaption();
                      }}
                    />
                  </CardDescription>
                ) : (
                  <CardDescription className="p-6 font-black text-white">
                    {" "}
                    {post.caption}{" "}
                  </CardDescription>
                )}
                <PostFooter postId={post?._id} likes={post?.likes} />
                <Button
                  className="text-white pl-6 text-xl w-fit bg-black"
                  onClick={() => {
                    setOpen(true);
                    setPostId(post._id);
                  }}
                >
                  {post.likes.length} likes
                </Button>
                <Link
                  href={`/posts/comments/${post._id}`}
                  className="text-white pl-6 text-xl"
                >
                  {post.comments.length} comments
                </Link>
              </Card>
            </div>
          );
        })}{" "}
      </div>
      <Footer />
    </div>
  );
};
export default Page;
