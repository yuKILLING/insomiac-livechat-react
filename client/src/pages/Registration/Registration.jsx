import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import { useMain } from "@/store/main";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { changeUserInfo, changeAuth } = useMain();
  const navigate = useNavigate();
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const login = () => {
    if (email.length > 0 && password.length > 0) {
      changeAuth(true);
      changeUserInfo({
        name: email,
        password: password,
      });
      navigate("/chat");
    }
  };

  return (
    <>
      <Header />
      <section className="flex justify-center items-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-3xl">Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    placeholder="Your Email"
                    value={email}
                    onChange={handleEmail}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Password</Label>
                  <Input
                    placeholder="Your password"
                    type="password"
                    value={password}
                    onChange={handlePassword}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={login}>Create account</Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
