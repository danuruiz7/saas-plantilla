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
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Mínimo 8 caracteres" }),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const t = useTranslations("Auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
      setServerError(t("errors.invalidToken"));
      return;
    }

    setIsLoading(true);
    setServerError("");
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.error === "INVALID_RESET_TOKEN"
            ? t("errors.invalidToken")
            : error.response?.data?.message || t("errors.default"),
        );
      } else {
        setServerError(t("errors.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{t("errors.invalidToken")}</CardTitle>
          <CardDescription>{t("backToLogin")}</CardDescription>
        </CardHeader>
        <CardContent>
           <Button asChild className="w-full">
            <Link href="/auth/login">{t("backToLogin")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("passwordLabel")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
