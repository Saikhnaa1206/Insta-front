"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorPassword, setErrorPassword] = useState<boolean>(false);

  const body = {
    username,
    password,
    email,
  };
  const router = useRouter();
  const validation = async () => {
    email && setErrorEmail(true);
    password && setErrorPassword(true);
    const jsonData = await fetch(
      "https://instagram-server-8xvr.onrender.com/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await jsonData.json();
    const token = data.token;
    localStorage.setItem("accessToken", token);
    router.push("/posts");
  };

  return (
    <div className=" bg-black flex justify-center items-center w-screen h-screen">
      <Card className="flex flex-col bg-black justify-center items-center border-0">
        <CardHeader>
          <CardTitle className="text-white italic">𝓘𝓷𝓼𝓽𝓪𝓰𝓻𝓪𝓶</CardTitle>
          <CardDescription>
            Sign up to see photos and videos <br />
            from your friends.
          </CardDescription>
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
          {errorEmail && <div className="text-cyan-200">email is wrong</div>}
          <Input
            className="text-white"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {errorPassword && (
            <div className="text-cyan-200">password is wrong</div>
          )}
          <Button onClick={validation}>Sign up</Button>
        </CardContent>
        <CardFooter className="flex gap-1">
          <p className="text-white">Have an account?</p>
          <Link href={"login"} className="text-white">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Page;
