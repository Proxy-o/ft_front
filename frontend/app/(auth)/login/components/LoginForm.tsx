"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader, User } from "lucide-react";
import { useState } from "react";
import useLogin from "../hooks/useLogin";
import useOAuthLogin from "../hooks/useOAuthLogin";

export default function LoginForm() {
  const { mutate: login, isError, isPending } = useLogin();
  const { mutate: OauthLogin, isPending: isLoading } = useOAuthLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = () => {
    login({ username, password });
  };

  const onOauthSubmit = (provider: string) => {
    OauthLogin(provider)
  }

  return (
    <form
      className="flex flex-col items-center justify-center h-screen"
      action={onSubmit}
    >
      <Card className="w-full max-w-md overflow-auto m-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username and password</CardDescription>
          {isError && (
            <Card className="text-primary text-sm mt-2 p-2 bg-primary/10">
              Invalid username or password
            </Card>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                name="username"
                placeholder="Username"
                type="text"
                onChange={(ev) => setUsername(ev.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <User className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">

            <div className="relative">
              <Input
                name="password"
                placeholder="Password"
                type={passwordVisible ? "text" : "password"}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <div
                className="hover:cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setPasswordVisible((prev) => !prev)}
              >
                {passwordVisible ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="h-5 w-5 text-secondary" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex w-full">
            <Button className="w-full" type="submit">
              {isPending ? (
                <Loader className="h-5 w-5 animate-spin animation" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
          <div className="flex w-32 justify-center my-4 text-xs items-center">
            <Separator className="my-4 mr-2 " />
            OR
            <Separator className="my-4 ml-2" />
          </div>
          <div className="flex w-full">
            <Button type="button" className="w-full" onClick={() => onOauthSubmit("42")}>
            {isLoading ? (
                <Loader className="h-5 w-5 animate-spin animation" />
              ) : (
                "Login with 42"
              )}
            </Button>
          </div>

          <div className="flex w-32 justify-center my-4 text-xs items-center">
            <Separator className="my-4 mr-2 " />
            OR
            <Separator className="my-4 ml-2" />
          </div>
          <div className="flex w-full">
            <Link className="w-full" href="/register">
              <Button
                className="w-full"
                variant="secondary"
                disabled={isPending}
              >
                Register
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
