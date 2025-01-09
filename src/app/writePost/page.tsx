"use client";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
const WritePost = () => {
  type tokenType = { userId: string; username: string };
  const token = localStorage.getItem("accessToken") ?? "";
  const decodedToken: tokenType = jwtDecode(token);
  const userId = decodedToken.userId;
  const router = useRouter();
  const [caption, setCaption] = useState<string>("");
  const [images, setImages] = useState<FileList | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const uploadImages = async () => {
    if (!images) return;

    const uploadPromises = Array.from(images).map(async (image) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "upload");
      formData.append("cloud_name", "dig2iwfma");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dig2iwfma/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      return result.secure_url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    setUploadedImages(uploadedUrls.filter((url) => url !== null) as string[]);
  };
  const createPost = async () => {
    const body = {
      caption,
      postImage: uploadedImages,
      userId,
    };
    if (uploadedImages.length > 0 && caption !== "") {
      await fetch(" https://instagram-server-8xvr.onrender.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      router.replace("/posts");
    }
  };
  return (
    <div className="bg-black w-screen h-screen text-white flex flex-col gap-3 items-center">
      <div className="flex w-full">
        <ChevronLeft
          className="text-white"
          onClick={() => {
            router.replace("posts");
          }}
        />
        <div className="italic text-xl bg-black text-white pl-6">Post</div>
      </div>

      <div className="flex justify-between w-full">
        {" "}
        <Input
          type="file"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setImages(files);
            }
          }}
          className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100 border-none"
        />
        <Button onClick={uploadImages}>Upload</Button>
      </div>
      {uploadedImages.map((img, index) => (
        <img
          key={index}
          src={img}
          className="max-w-full h-[300px] rounded-lg shadow-lg"
        />
      ))}
      <Input
        className="text-white border-none"
        placeholder="Caption"
        value={caption}
        multiple
        onChange={(e) => {
          setCaption(e.target.value);
        }}
      />

      <Button className="w-fit" onClick={createPost}>
        post
      </Button>
    </div>
  );
};
export default WritePost;
