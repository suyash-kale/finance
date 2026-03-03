import { type FC, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInRequest, type UserType } from "@root/database/types";
import { emailExists, signInOptions } from "@/services/auth";
import { useSessionStore } from "@/store/session";

export const SignIn: FC = () => {
  const navigate = useNavigate();

  const { signIn } = useSessionStore();

  const form = useForm<SignInRequest>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: classValidatorResolver(SignInRequest),
  });

  const { handleSubmit } = form;

  const [exists, setExists] = useState(false);

  const onSuccess = useCallback(
    (data: UserType) => {
      signIn(data);
      toast.success(`Welcome, ${data.fname}!`);
      navigate("/dashboard");
    },
    [signIn, navigate],
  );

  const { mutate, isPending } = useMutation(signInOptions({ onSuccess }));

  const onSubmit = useCallback(
    (data: SignInRequest) => {
      if (!exists) {
        toast.error("Invalid email or password.");
        return;
      }
      mutate(data);
    },
    [mutate, exists],
  );

  const onSubmitError = useCallback(() => {
    toast.error("Please check your input and try again.");
  }, []);

  const onEmailBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      setExists(false);
      const bol = await emailExists(e.target.value);
      setExists(bol);
    },
    [],
  );

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Card className="w-100" loading={isPending}>
        <CardHeader>
          <CardTitle className="text-xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Be a step ahead in your financial journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onSubmitError)}
            className="flex flex-col gap-3"
          >
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter email.."
                {...form.register("email")}
                disabled={isPending}
                onBlur={onEmailBlur}
              />
              <FieldDescription>
                {form.formState.errors.email?.message}
              </FieldDescription>
            </Field>
            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter password.."
                {...form.register("password")}
                disabled={isPending}
              />
              <FieldDescription>
                {form.formState.errors.password?.message}
              </FieldDescription>
            </Field>
            <div className="flex items-center justify-end">
              <Button type="submit" loading={isPending}>
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center px-4 py-2 shadow-inner">
          Don't have an account?
          <Link to="/sign-up" className="underline ml-1">
            Sign up
          </Link>
        </CardFooter>
      </Card>
      <div className="w-100 text-xs text-gray-600 text-center mt-4">
        <div>By clicking submit, you agree to our</div>
        <div>
          <Link to="/" className="underline">
            Terms of Service
          </Link>
          <span className="mx-1">and</span>
          <Link to="/" className="underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
