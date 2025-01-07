"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import WriteComment from "@/app/components/WriteComment";
type User = {
  _id: string;
  username: string;
  profileImage: string;
};
type Comment = {
  _id: string;
  comment: string;
  userId: User;
  postId: string;
};

const Page = () => {
  const { id } = useParams() || "";
  const [comments, setComments] = useState<Comment[]>([]);
  const token = localStorage.getItem("accessToken");
  const getPost = async () => {
    const jsonData = await fetch(
      `https://instagram-server-8xvr.onrender.com/getCommentOfOnePost/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setComments(response);
  };
  useEffect(() => {
    getPost();
  }, [id]);

  return (
    <div className="relative flex flex-col justify-start bg-black h-screen w-screen">
      <div className=" flex flex-col justify-start gap-5 items-center">
        {" "}
        <div className="flex w-3/3 justify-start">
          {" "}
          <Link href={`/posts`}>
            {" "}
            <ChevronLeft className="text-white" />
          </Link>
          <div className="italic text-xl bg-black text-white pl-6">
            Comments
          </div>
        </div>
        <div className="flex flex-col gap-2 w-4/5">
          {" "}
          {comments?.map((comment) => {
            return (
              <Card key={comment._id} className="bg-black border-none ">
                <CardContent className="p-0 flex">
                  <Avatar>
                    <AvatarImage src={comment.userId.profileImage} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    {" "}
                    <div className="text-white font-bold">
                      {comment.userId.username}
                    </div>
                    <div className="text-white font-light">
                      {" "}
                      {comment.comment}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}{" "}
        </div>
        <WriteComment postId={id as string} />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
