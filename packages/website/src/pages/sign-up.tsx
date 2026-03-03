import { type FC, useCallback } from "react";
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
import { SignUpRequest, type UserType } from "@root/database/types";
import { signUpOptions } from "@/services/auth";
import { useSessionStore } from "@/store/session";

export const SignUp: FC = () => {
  const navigate = useNavigate();

  const { signIn } = useSessionStore();

  const form = useForm<SignUpRequest>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: classValidatorResolver(SignUpRequest),
  });

  const { handleSubmit } = form;

  const onSuccess = useCallback(
    (data: UserType) => {
      signIn(data);
      toast.success(`Welcome, ${data.fname}!`);
      navigate("/dashboard");
    },
    [signIn, navigate],
  );

  const { mutate, isPending } = useMutation(signUpOptions({ onSuccess }));

  const onSubmit = useCallback(
    (data: SignUpRequest) => {
      mutate(data);
    },
    [mutate],
  );

  const onSubmitError = useCallback(() => {
    toast.error("Please check your input and try again.");
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Card className="w-100" loading={isPending}>
        <CardHeader>
          <CardTitle className="text-xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Be a step ahead in your financial journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onSubmitError)}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={!!form.formState.errors.fname}>
                <FieldLabel htmlFor="fname">First name</FieldLabel>
                <Input
                  id="fname"
                  type="text"
                  placeholder="Enter first name.."
                  {...form.register("fname")}
                  disabled={isPending}
                />
                <FieldDescription>
                  {form.formState.errors.fname?.message}
                </FieldDescription>
              </Field>
              <Field data-invalid={!!form.formState.errors.lname}>
                <FieldLabel htmlFor="lname">Last name</FieldLabel>
                <Input
                  id="lname"
                  type="text"
                  placeholder="Enter last name.."
                  {...form.register("lname")}
                  disabled={isPending}
                />
                <FieldDescription>
                  {form.formState.errors.lname?.message}
                </FieldDescription>
              </Field>
            </div>
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter email.."
                {...form.register("email")}
                disabled={isPending}
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
          Already have an account?
          <Link to="/sign-in" className="underline ml-1">
            Sign in
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
