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
import { Asterisk, AtSign, User } from "lucide-react";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Card className="w-full max-w-md ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your credentials to register</CardDescription>
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
              <Label htmlFor="password">Email</Label>
            </div>
            <div className="relative">
              <Input placeholder="Email" type="email" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AtSign className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex w-full ">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Input placeholder="Password" type="password" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Asterisk className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Link className="w-full" href="/register">
            <Button className="w-full" variant="default">
              Register
            </Button>
          </Link>
          <div className="flex w-32 justify-center my-4 text-xs items-center">
            <Separator className="my-4 mr-2 " />
            OR
            <Separator className="my-4 ml-2" />
          </div>
          <div className="flex w-full">
            <Link className="w-full" href="/login">
              <Button className="w-full" variant="secondary">
                Login
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
