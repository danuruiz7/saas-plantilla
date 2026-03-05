"use client";

import axios from "axios";
import { useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
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
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/**
 * Screen for accepting team invitations.
 * Matches URL: /accept-invite?token=...
 */

const acceptInviteSchema = z.object({
  name: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  password: z.string().min(8, { message: "Mínimo 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "Mínimo 8 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

function AcceptInviteContent() {
  const t = useTranslations("Auth.acceptInvite");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof acceptInviteSchema>>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { name: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof acceptInviteSchema>) {
    if (!token) {
      setServerError(t("errors.invalidToken"));
      return;
    }

    setIsLoading(true);
    setServerError("");
    
    try {
      await authService.acceptInvite({
        token,
        name: values.name,
        password: values.password,
      });
      setIsSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || t("errors.default")
        );
      } else {
        setServerError(t("errors.default"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Enlace inválido</CardTitle>
          <CardDescription>
            A esta invitación le falta el token de seguridad o ya fue utilizada.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/auth/login")}>
            Ir al inicio de sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t("successTitle")}</CardTitle>
          <CardDescription>{t("successDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full" onClick={() => router.push("/auth/login")}>
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-xl border-zinc-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("passwordLabel")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
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
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <div className="flex items-center gap-2 p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submitButton")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10 bg-gray-500">
      <Suspense fallback={<div>Cargando...</div>}>
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
