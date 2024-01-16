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

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username and password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Username" required />
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
            <Input
              id="password"
              placeholder="Password"
              required
              type="password"
            />
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
            <Button className="w-full" variant="secondary">
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
