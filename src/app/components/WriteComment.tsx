"use client";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
type tokenType = { userId: string; username: string };
const WriteComment = ({ postId }: { postId: string }) => {
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const { userId } = decodedToken;
  const [comment, setComment] = useState<string>();
  const body = {
    postId,
    userId,
    comment,
  };
  const commentWrite = async () => {
    if (comment) {
      await fetch(" https://instagram-server-8xvr.onrender.com/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      setComment("");
    }
  };

  return (
    <div className="text-white flex fixed bottom-10">
      <Input
        className="border-none w-80"
        placeholder="Add a comment"
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <Send onClick={() => commentWrite()} />
    </div>
  );
};
export default WriteComment;
