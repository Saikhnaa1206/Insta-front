"use client";
import { CardFooter } from "@/components/ui/card";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
type tokenType = { userId: string; username: string };
const PostFooter = ({ postId, likes }: { postId: string; likes: string[] }) => {
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const { userId } = decodedToken;
  const isUser = likes.includes(userId);

  const [liked, setLiked] = useState(isUser);
  const body = {
    postId,
    userId,
  };
  const like = async () => {
    if (isUser) {
      setLiked(false);
      await fetch(" https://instagram-server-8xvr.onrender.com/unlikeToPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } else {
      setLiked(true);
      await fetch(" https://instagram-server-8xvr.onrender.com/likeToPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    }
  };
  return (
    <>
      <CardFooter className="flex justify-between">
        <div className="flex gap-1">
          {" "}
          <Heart
            color={liked ? "red" : "white"}
            fill={liked ? "red" : "black"}
            onClick={() => like()}
          />
          <MessageCircle className="text-white" />
          <Send className="text-white" />
        </div>
        <Bookmark className="text-white" />
      </CardFooter>
    </>
  );
};
export default PostFooter;
