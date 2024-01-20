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
import { Asterisk, Key, User } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/lib/providers/UserContext";

export default function LoginForm() {
  const userContext = useContext(UserContext);
  const { currentUser, setCurrentUser } = userContext;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Card className="w-full max-w-md ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username and password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input placeholder="Username" type="text" />
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
              <Input placeholder="Password" type="text" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Asterisk className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex w-full">
            <Button className="w-full">Login</Button>
          </div>
          <div className="flex w-32 justify-center my-4 text-xs items-center">
            <Separator className="my-4 mr-2 " />
            OR
            <Separator className="my-4 ml-2" />
          </div>
          <div className="flex w-full">
            <Link className="w-full" href="/register">
              <Button className="w-full" variant="secondary">
                Register
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
