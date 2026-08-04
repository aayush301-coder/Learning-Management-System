import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerSchema } from "../schemas/authSchemas";
import { registerRequest } from "../api/authApi";

import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: "student" } });

  const onSubmit = async (data) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = data;

      await registerRequest(payload);

      toast.success("Account created. You can now log in.");
      navigate("/login");
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      const message =
        backendErrors?.[0]?.message || error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">Join Okla</p>
        <h1 className="font-display mt-1 text-2xl font-semibold text-ink">Create an account</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name" placeholder="e.g. John Doe" {...register("name")} error={errors.name?.message} />

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
          placeholder="At least 8 characters"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Select label="I am joining as a" {...register("role")} error={errors.role?.message}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </Select>

        <Button type="submit" className="mt-2 w-full font-semibold py-2.5" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="mt-4 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-inkblue hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
