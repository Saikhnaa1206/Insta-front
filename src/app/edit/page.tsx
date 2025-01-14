"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type tokenType = { userId: string; username: string };
type userType = {
  username: string;
  profileImage: string;
  bio: string;
};
const Page = () => {
  const router = useRouter();

  const [accountId, setAccountId] = useState("");
  const [user, setUser] = useState<userType>();
  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [bio, setBio] = useState<string | undefined>(user?.bio);

  const getUser = async () => {
    const token = localStorage.getItem("accessToken") ?? "";
    const jsonData = await fetch(
      `https://instagram-server-8xvr.onrender.com/getAllOfOneUser/${accountId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await jsonData.json();
    setUser(response);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken") ?? "";
    const decodedToken: tokenType = jwtDecode(token);
    setAccountId(decodedToken.userId);
    if (!token) {
      router.push("/login");
    } else {
      getUser();
    }
  }, []);

  const [image, setImage] = useState<File | null>(null);

  const uploadImage = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ace_area");
    formData.append("cloud_name", "dl93ggn7x");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dl93ggn7x/image/upload",
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
  };
  const update = async () => {
    const token = localStorage.getItem("accessToken") ?? "";
    const uploadedImages = await uploadImage();
    const body = {
      username: username === undefined ? user?.username : username,
      bio: bio === undefined ? user?.bio : bio,
      profileImage:
        uploadedImages === undefined ? user?.profileImage : uploadedImages,
      userId: accountId,
    };
    await fetch(" https://instagram-server-8xvr.onrender.com/updateUser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  };
  return (
    <div className="bg-black w-screen h-screen flex flex-col gap-5 ">
      <div className="flex">
        {" "}
        <ChevronLeft
          className="text-white"
          onClick={() => {
            router.replace(`/profile/${accountId}`);
          }}
        />
        <div className="italic text-xl bg-black text-white pl-6">
          Edit profile
        </div>
      </div>
      <div className="flex flex-col align-center gap-2 justify-center">
        {" "}
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files;
            if (file) {
              setImage(file[0]);
            }
          }}
          className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100 border-none"
        />
        <div className="flex items-center px-6">
          <div className="text-white w-2/5">Username</div>
          <Input
            type="text"
            placeholder="Username"
            className="border-none text-white"
            value={username}
            defaultValue={user?.username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center px-6">
          <div className="text-white w-2/5">Bio</div>
          <Input
            type="text"
            placeholder="Bio"
            value={bio}
            defaultValue={user?.bio === undefined ? "" : user?.bio}
            className="border-none text-white"
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => {
              update();
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Page;
