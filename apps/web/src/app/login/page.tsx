"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";
type PublicRole = "COUPLE" | "VENDOR";

const PUBLIC_ROLES: PublicRole[] = ["COUPLE", "VENDOR"];
const MIN_PASSWORD_LENGTH = 8;

function getRedirectPath(role?: string | null) {
  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "VENDOR") {
    return "/dashboard/vendor";
  }

  if (role === "COUPLE") {
    return "/dashboard/couple";
  }

  return "/";
}

async function getCurrentSessionRole() {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const session = await response.json();
  return session?.user?.role ?? null;
}

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mode, setMode] = useState<AuthMode>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<PublicRole>("COUPLE");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const isBusy = isLoggingIn || isRegistering;

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(getRedirectPath(session?.user?.role));
    }
  }, [router, session?.user?.role, status]);

  const heading = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Welcome back",
            description: "Sign in to manage your event journey, bookings, and planning tools.",
          }
        : {
            title: "Create your account",
            description: "Join as a couple or vendor to unlock your Maison Events dashboard.",
          },
    [mode]
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoginError("");

    const normalizedEmail = loginEmail.trim().toLowerCase();

    if (!normalizedEmail || !loginPassword) {
      setLoginError("Please enter both your email and password.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password: loginPassword,
        redirect: false,
      });

      if (!result || result.error) {
        setLoginError("Invalid email or password.");
        return;
      }

      const sessionRole = (await getCurrentSessionRole()) ?? session?.user?.role ?? null;

      router.replace(getRedirectPath(sessionRole));
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Unable to sign in right now. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setRegisterError("");
    setRegisterSuccess("");

    const normalizedName = registerName.trim();
    const normalizedEmail = registerEmail.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !registerPassword || !confirmPassword) {
      setRegisterError("Please complete all required fields.");
      return;
    }

    if (!PUBLIC_ROLES.includes(registerRole)) {
      setRegisterError("Please choose a valid account type.");
      return;
    }

    if (registerPassword.length < MIN_PASSWORD_LENGTH) {
      setRegisterError("Password must be at least 8 characters long.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password: registerPassword,
          role: registerRole,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setRegisterError(data?.message || "Unable to create your account.");
        return;
      }

      setRegisterSuccess("Account created successfully. Signing you in...");

      const signInResult = await signIn("credentials", {
        email: normalizedEmail,
        password: registerPassword,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setRegisterSuccess("Account created successfully. Please sign in to continue.");
        setMode("login");
        setLoginEmail(normalizedEmail);
        setLoginPassword("");
        return;
      }

      const sessionRole = (await getCurrentSessionRole()) ?? registerRole;

      router.replace(getRedirectPath(sessionRole));
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("Unable to create your account right now. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-rose-50 via-white to-stone-50 px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <div className="flex-1 rounded-3xl border border-rose-100 bg-white/70 p-8 shadow-sm backdrop-blur">
          <div className="max-w-xl space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
                Maison Events
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
                Plan beautifully. Book confidently.
              </h1>
              <p className="text-base leading-7 text-stone-600">
                Couples can organize their celebration in one place, while vendors can
                showcase their services and respond to inquiries from the right clients.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-medium text-stone-900">For couples</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Track plans, manage your wishlist, and keep your wedding prep moving.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-medium text-stone-900">For vendors</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Present your business, maintain your profile, and connect with engaged
                  couples.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-xl border-rose-100 shadow-xl shadow-rose-100/40">
          <CardContent className="p-0">
            <div className="border-b border-stone-200 p-6">
              <div className="inline-flex rounded-full border border-stone-200 bg-stone-50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setRegisterError("");
                    setRegisterSuccess("");
                  }}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition",
                    mode === "login"
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  )}
                  disabled={isBusy}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setLoginError("");
                  }}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition",
                    mode === "register"
                      ? "bg-stone-900 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  )}
                  disabled={isBusy}
                >
                  Register
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <h2 className="text-2xl font-semibold text-stone-900">{heading.title}</h2>
                <p className="text-sm leading-6 text-stone-600">{heading.description}</p>
              </div>
            </div>

            <div className="p-6">
              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium text-stone-700">
                      Email address
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      disabled={isBusy || status === "loading"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="login-password"
                      className="text-sm font-medium text-stone-700"
                    >
                      Password
                    </label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      disabled={isBusy || status === "loading"}
                    />
                  </div>

                  {loginError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {loginError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isBusy || status === "loading"}
                  >
                    {isLoggingIn ? "Signing in..." : "Sign in"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-stone-500 uppercase tracking-widest text-[10px] font-bold">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 border-stone-200 hover:bg-stone-50"
                    onClick={() => signIn("google")}
                    disabled={isBusy || status === "loading"}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="register-name"
                      className="text-sm font-medium text-stone-700"
                    >
                      Full name
                    </label>
                    <Input
                      id="register-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={registerName}
                      onChange={(event) => setRegisterName(event.target.value)}
                      disabled={isBusy}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="register-email"
                      className="text-sm font-medium text-stone-700"
                    >
                      Email address
                    </label>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      disabled={isBusy}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="register-role"
                      className="text-sm font-medium text-stone-700"
                    >
                      Account type
                    </label>
                    <select
                      id="register-role"
                      value={registerRole}
                      onChange={(event) => setRegisterRole(event.target.value as PublicRole)}
                      disabled={isBusy}
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                    >
                      <option value="COUPLE">Couple</option>
                      <option value="VENDOR">Vendor</option>
                    </select>
                    <p className="text-xs text-stone-500">
                      Public registration is available for couples and vendors only.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="register-password"
                        className="text-sm font-medium text-stone-700"
                      >
                        Password
                      </label>
                      <Input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Minimum 8 characters"
                        value={registerPassword}
                        onChange={(event) => setRegisterPassword(event.target.value)}
                        disabled={isBusy}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium text-stone-700"
                      >
                        Confirm password
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                  </div>

                  {registerError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {registerError}
                    </div>
                  ) : null}

                  {registerSuccess ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {registerSuccess}
                    </div>
                  ) : null}

                  <Button type="submit" className="w-full" disabled={isBusy}>
                    {isRegistering ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}