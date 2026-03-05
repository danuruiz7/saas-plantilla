"use client";

import axios from "axios";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "@/i18n/routing";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth.forgotPassword");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    setServerError("");
    try {
      await api.post("/auth/forgot-password", data);
      setIsSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || t("errors.default"));
      } else {
        setServerError(t("errors.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("successTitle")}</CardTitle>
          <CardDescription>
            {t("successDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">{t("backToLogin")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <div className="text-sm font-medium text-destructive">
                {serverError}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("submitting") : t("submitButton")}
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                {t("cancel")}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
