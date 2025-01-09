"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const body = {
    email,
    password,
    username,
  };
  const router = useRouter();
  const validation = async () => {
    const jsonData = await fetch(
      "https://instagram-server-8xvr.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await jsonData.json();

    if (data) {
      const token = data.token;
      localStorage.setItem("accessToken", token);
      router.push("/posts");
    } else {
    }
  };
  return (
    <div className=" bg-black flex justify-center items-center w-screen h-screen">
      <Card className="flex flex-col bg-black justify-center items-center border-0">
        <CardHeader>
          <CardTitle className="text-white italic">𝓘𝓷𝓼𝓽𝓪𝓰𝓻𝓪𝓶</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input
            className="text-white"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            className="text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            className="text-white"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button onClick={() => validation()}>Log in</Button>
        </CardContent>
        <CardFooter className="flex gap-1">
          <p className="text-white">Don&apos;t have an account?</p>
          <Link href={"/signup"} className="text-white">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Page;
