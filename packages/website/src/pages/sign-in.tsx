import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FC } from "react";
import { Link } from "react-router";

export const SignIn: FC = () => {
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
          <form className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="Enter email.." />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter password.."
              />
            </Field>
            <div className="flex items-center justify-end">
              <Button>Submit</Button>
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
