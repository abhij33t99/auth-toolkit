"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const onClick = (provider: "google" | "github") => {
    try {
      signIn(provider, {
        callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex items-center w-full gap-x-6">
      <Button
        size="icon"
        className="w-[90%] flex gap-x-1"
        onClick={() => onClick("google")}
      >
        <FcGoogle />
        <span className="font-light">Sign in with Google</span>
      </Button>
      <Button
        size="icon"
        className="w-[90%] flex gap-x-1"
        onClick={() => onClick("github")}
      >
        <FaGithub />
        <span className="font-light">Sign in with Github</span>
      </Button>
    </div>
  );
};

export default Social;
