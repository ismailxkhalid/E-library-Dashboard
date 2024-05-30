import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/http/api";
import { LoaderPinwheel } from "lucide-react";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

// Define a type for the error response
interface ErrorResponse {
  message: string;
}

function Signup() {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      console.log("signup success", data);
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

  const handleSignup = () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !email || !password) {
      return alert("Please enter name, email, and password");
    }
    setError(null); // Clear previous error messages
    mutation.mutate({ name, email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input ref={nameRef} id="name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
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
            <Button
              type="submit"
              onClick={handleSignup}
              className="w-full flex gap-2 items-center justify-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <LoaderPinwheel className="animate-spin" />
              )}
              <span>Create an account</span>
            </Button>
            {error && <span className="text-red-500 text-center">{error}</span>}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default Signup;
