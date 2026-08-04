import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../schemas/authSchemas";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      const user = response.data?.user;

      toast.success("Logged in successfully");

      if (user?.role === "admin") navigate("/admin/dashboard");
      else if (user?.role === "instructor") navigate("/instructor/dashboard");
      else navigate("/student/dashboard");
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      const message =
        backendErrors?.[0]?.message || error.response?.data?.message || "Invalid email or password.";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">Welcome back</p>
        <h1 className="font-display mt-1 text-2xl font-semibold text-ink">Sign in to Okla</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" className="mt-2 w-full font-semibold py-2.5" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="mt-4 text-center text-sm text-ink-soft">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-semibold text-inkblue hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
