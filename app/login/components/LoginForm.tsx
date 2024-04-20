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
import { Asterisk, Loader, User } from "lucide-react";
import { useState } from "react";
import useLogin from "../hooks/useLogin";

export default function LoginForm() {
  const { mutate: login, isError, isPending } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    login({ username, password });
  };

  return (
    <form
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden"
      action={onSubmit}
    >
      <Card className="w-full max-w-md ">
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
            <div className="flex w-full ">
              <Label htmlFor="password">Password</Label>
              <Link
                className="flex justify-end w-full  text-xs underline "
                href="#"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                name="password"
                placeholder="Password"
                type="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Asterisk className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex w-full">
            <Button className="w-full" onClick={onSubmit}>
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
