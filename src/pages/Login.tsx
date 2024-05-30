import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/http/api";
import { LoaderPinwheel, Eye, EyeOff } from "lucide-react";
import { AxiosError } from "axios";
import useTokenStore from "@/store";

// Define a type for the error response
interface ErrorResponse {
  message: string;
}

const Login = () => {
  const { token, setToken } = useTokenStore();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setToken(response.data.token);
      // Redirect to dashboard
      navigate("/dashboard/home");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    },
  });

  const handleLogin = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    console.log(emailRef.current?.value, passwordRef.current?.value);

    if (!email || !password) {
      return alert("Please enter email and password");
    }
    setError(null); // Clear previous error messages
    mutation.mutate({ email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="m@example.com"
              required={true}
            />
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              ref={passwordRef}
              id="password"
              type={showPassword ? "text" : "password"} // Change input type based on state
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/5"
            >
              {showPassword ? <EyeOff /> : <Eye />} {/* Toggle eye icon */}
            </button>
          </div>
        </CardContent>
        <CardFooter className="grid gap-2">
          <Button
            onClick={handleLogin}
            className="w-full flex gap-2 items-center justify-center"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <LoaderPinwheel className="animate-spin" />}
            <span>Log in</span>
          </Button>
          {error && <span className="text-red-500 text-center">{error}</span>}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
