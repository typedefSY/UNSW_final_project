"use client";

import { isAPIError, type Featured } from "@/backend";
import { Logo } from "@/components/Logo";
import { CenteredLoading } from "@/components/loading";
import { LoginForm } from "@/components/login/LoginForm";
import { RegisterForm } from "@/components/login/RegisterForm";
import { ResetForm } from "@/components/login/ResetForm";
import { VerificationForm } from "@/components/login/VerificationForm";
import { useBackend } from "@/hooks/useBackend";
import { useRefState } from "@/hooks/useRefState";
import { Callout, Card } from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import Cookies from "js-cookie";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {}

const kEmailError =
  "There is already an account associated with this email. Please sign in or use a different email.";

const kAccountNotFoundError = "Account not found. Please check your email.";

const Login: React.FC<Props> = () => {
  const user = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      void router.replace("/dashboard");
      router.refresh();
    }
  }, [router, user]);

  const [featured, setFeatured] = useState<Featured | null>(null);

  const backend = useBackend();
  useEffect(() => {
    const inner = async () => {
      const { featured } = await backend.getFeatured({});
      setFeatured(featured);
    };

    void inner();
  }, [backend]);

  // step: "loggedin" | "login" | "register" | "reset"
  const [step, setStep] = useState<
    | "loggedin"
    | "login"
    | "register"
    | "reset"
    | "verify-register"
    | "verify-reset"
  >("login");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError, errorRef] = useRefState<string>("");

  const onChangeFirstName = useCallback((firstName: string) => {
    setFirstName(firstName);
  }, []);

  const onChangeLastName = useCallback((lastName: string) => {
    setLastName(lastName);
  }, []);

  const onChangeEmail = useCallback((email: string) => {
    setEmail(email);
  }, []);

  const onChangePassword = useCallback((password: string) => {
    setPassword(password);
  }, []);

  const onChangeVerificationCode = useCallback((verificationCode: string) => {
    setVerificationCode(verificationCode);
  }, []);

  const onClickCreateAccount = useCallback(() => {
    setFirstName("");
    setLastName("");
    setPassword("");
    setStep("register");
  }, []);

  const onClickForgotPassword = useCallback(() => {
    setFirstName("");
    setLastName("");
    setPassword("");
    setStep("reset");
  }, []);

  const onClickBack = useCallback(() => {
    if (step === "register") {
      setPassword("");
      setStep("login");
    }
    if (step === "reset") {
      setPassword("");
      setStep("login");
    }
    if (step === "verify-register") {
      setPassword("");
      setStep("register");
    }
    if (step === "verify-reset") {
      setEmail("");
      setPassword("");
      setStep("reset");
    }
  }, [step]);

  const pathName = usePathname();

  const onClickSignIn = useCallback(async () => {
    try {
      const { token } = await backend.login({ email, password });

      Cookies.set("token", token, { expires: 7 });

      if (pathName == "/login") {
        router.replace("/dashboard");
      }

      window.location.reload();
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      }
    }
  }, [backend, email, password, pathName, router, setError]);

  const onClickRegisterConfirm = useCallback(async () => {
    const { taken } = await backend.checkEmail({ email });
    if (taken) {
      setError(kEmailError);
      return;
    }

    try {
      await backend.verifyEmail({ email });

      setStep("verify-register");
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      }
    }
  }, [backend, email, setError]);

  useEffect(() => {
    setError("");
  }, [setError, step]);

  useEffect(() => {
    if (errorRef.current === kEmailError) {
      setError("");
    }
  }, [email, errorRef, setError]);

  const onClickSendResetEmail = useCallback(async () => {
    try {
      const { taken } = await backend.checkEmail({ email });
      if (!taken) {
        setPassword("");
        setError(kAccountNotFoundError);
        return;
      }

      await backend.verifyForgotPassword({ email });

      setStep("verify-reset");
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      }
    }
  }, [backend, email, setError]);

  const onClickRegisterVerify = useCallback(async () => {
    try {
      await backend.register({
        email,
        firstName,
        lastName,
        password,
        otp: verificationCode,
      });
      setStep("login");
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      }
    }
  }, [
    backend,
    email,
    firstName,
    lastName,
    password,
    setError,
    verificationCode,
  ]);

  const onClickResetVerify = useCallback(async () => {
    try {
      await backend.forgotPassword({
        email,
        newPassword: password,
        otp: verificationCode,
      });
      setStep("login");
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      }
    }
  }, [backend, email, password, setError, verificationCode]);

  if (!featured) {
    return <CenteredLoading />;
  }

  const getForm = () => {
    return (
      <>
        {error && (
          <Callout.Root className="my-4" color="red">
            <Callout.Icon>
              <VscError color="red"></VscError>
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        {step === "login" && (
          <LoginForm
            password={password}
            email={email}
            onChangeEmail={onChangeEmail}
            onChangePassword={onChangePassword}
            onClickCreateAccount={onClickCreateAccount}
            onClickForgotPassword={onClickForgotPassword}
            onClickSignIn={onClickSignIn}
          />
        )}
        {step === "register" && (
          <RegisterForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            password={password}
            onChangeEmail={onChangeEmail}
            onChangeFirstName={onChangeFirstName}
            onChangeLastName={onChangeLastName}
            onChangePassword={onChangePassword}
            onClickRegisterConfirm={onClickRegisterConfirm}
            onClickBack={onClickBack}
          />
        )}
        {step === "reset" && (
          <ResetForm
            email={email}
            password={password}
            onChangeEmail={onChangeEmail}
            onChangePassword={onChangePassword}
            onClickBack={onClickBack}
            onClickSendResetEmail={onClickSendResetEmail}
          />
        )}
        {step.startsWith("verify-") && (
          <VerificationForm
            email={email}
            verificationCode={verificationCode}
            onChangeVerificationCode={onChangeVerificationCode}
            onClickBack={onClickBack}
            onClickVerify={
              step === "verify-register"
                ? onClickRegisterVerify
                : onClickResetVerify
            }
          />
        )}
      </>
    );
  };

  return (
    <div className="w-full h-full">
      {/* Background */}
      {featured?.background && (
        <div className="-z-10 lg:block hidden">
          <div className="bg-black opacity-70 w-full h-full absolute top-0 left-0 -z-10"></div>
          <img
            src={featured?.background}
            className="object-cover w-full h-full absolute left-0 top-0 -z-20"
            alt="background"
          />
        </div>
      )}

      <div className="mx-16 h-full flex flex-row lg:justify-between justify-center object-center lg:space-x-20">
        <div className="flex-col h-full justify-center ml-10 hidden lg:flex max-w-screen-sm">
          <div className="space-y-8">
            <Logo size="medium" variant="white"></Logo>
            <div className="text-white text-3xl lg:text-4xl xl:text-5xl font-extrabold">
              “{featured?.title}”
            </div>
            <div className="text-white font-bold text-xl">
              {featured?.description}
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full flex-shrink-0 justify-center w-full lg:w-fit flex-1 items-center">
          <Card
            className="hidden lg:block min-w-[400px] backdrop-blur-sm w-min"
            size="4"
          >
            {getForm()}
          </Card>
          <div className="lg:hidden flex justify-center items-center w-full">
            <div className="flex-1 max-w-96">
              <Logo size="small" className="mx-auto my-8" variant="color" />
              {getForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
