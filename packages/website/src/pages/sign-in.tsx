import { type FC, useCallback } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInRequest } from "@root/database/types";

export const SignIn: FC = () => {
  const form = useForm<SignInRequest>({
    mode: "onTouched",
    reValidateMode: "onChange",
    resolver: classValidatorResolver(SignInRequest),
  });

  const { handleSubmit } = form;

  const onSuccess = useCallback((data: SignInRequest) => {
    console.log(data);
  }, []);

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Card className="w-100">
        <CardHeader>
          <CardTitle className="text-xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Be a step ahead in your financial journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSuccess)}
            className="flex flex-col gap-3"
          >
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter email.."
                {...form.register("email")}
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
              />
              <FieldDescription>
                {form.formState.errors.password?.message}
              </FieldDescription>
            </Field>
            <div className="flex items-center justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </CardContent>
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
