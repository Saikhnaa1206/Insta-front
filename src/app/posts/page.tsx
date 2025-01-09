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

const Page = () => {
  const [posts, setPosts] = useState<postType>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const router = useRouter();
  const token = localStorage.getItem("accessToken");
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
              <Card className="flex flex-col justify-center text-xl bg-black border-none">
                <CardHeader
                  onClick={() => router.push(`/profile/${post.userId._id}`)}
                >
                  <div className="flex gap-2 items-center ">
                    <Avatar>
                      <AvatarImage src={post.userId.profileImage} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-white">{post.userId.username}</div>
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
                <CardDescription className="p-6 font-black text-white">
                  {" "}
                  {post.caption}
                </CardDescription>
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
