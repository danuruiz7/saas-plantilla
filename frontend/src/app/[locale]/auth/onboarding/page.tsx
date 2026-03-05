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
  FormDescription,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const onboardingSchema = z.object({
  tenantName: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  tenantSlug: z
    .string()
    .min(3, { message: "Mínimo 3 caracteres" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Solo minúsculas, números y guiones",
    }),
  userName: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Mínimo 8 caracteres" }),
});

export default function OnboardingPage() {
  const t = useTranslations("Auth.onboarding");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      tenantName: "",
      tenantSlug: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof onboardingSchema>) {
    setIsLoading(true);
    setServerError("");
    try {
      await api.post("/auth/register-tenant", data);
      router.push("/auth/login?registered=true");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.error === "TENANT_SLUG_TAKEN"
            ? t("errors.slugTaken")
            : error.response?.data?.message || t("errors.default"),
        );
      } else {
        setServerError(t("errors.unexpected"));
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tenantName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{t("tenantNameLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Mi Empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tenantSlug"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{t("tenantSlugLabel")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            app.com/
                          </span>
                          <Input placeholder="mi-empresa" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>{t("slugDescription")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("userNameLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
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
    </div>
  );
}
