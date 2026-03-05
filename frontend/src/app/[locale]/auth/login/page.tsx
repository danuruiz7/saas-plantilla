"use client";

import axios from "axios";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
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

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

export default function LoginPage() {
  const t = useTranslations("Auth.login");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "owner1@test.com", password: "Test1234!" },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setServerError("");
    console.log("data",data);
    try {
      const response = await api.post("/auth/login", data);
      console.log("response",response);
      login(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Error al iniciar sesión",
        );
      } else {
        setServerError("Error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>{t("passwordLabel")}</FormLabel>
                      <a
                        href="#"
                        className="inline-block ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        {t("forgotPassword")}
                      </a>
                    </div>
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
                {isLoading ? t("loggingIn") : t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
