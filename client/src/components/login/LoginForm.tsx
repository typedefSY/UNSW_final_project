import { Box, Button, Flex, Link, Text, TextField } from "@radix-ui/themes";
import React, { useCallback } from "react";

interface Props {
  email: string;
  onChangeEmail: (email: string) => void;

  password: string;
  onChangePassword: (password: string) => void;

  onClickCreateAccount: () => void;
  onClickForgotPassword: () => void;
  onClickSignIn: () => void;
}

export const LoginForm: React.FC<Props> = ({
  email,
  onChangeEmail,
  password,
  onChangePassword,
  onClickCreateAccount,
  onClickSignIn,
  onClickForgotPassword,
}) => {
  const onChangeEmailInner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeEmail(e.currentTarget.value);
    },
    [onChangeEmail],
  );

  const onChangePasswordInner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangePassword(e.currentTarget.value);
    },
    [onChangePassword],
  );

  return (
    <div>
      <div className="text-2xl font-bold mb-4 text-center lg:text-left">
        Sign in
      </div>

      <Box mb="5">
        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            Email address
          </Text>
          <TextField.Root
            variant="surface"
            size={"3"}
            placeholder="Enter your email"
            value={email}
            onChange={onChangeEmailInner}
          />
        </label>
      </Box>

      <Box mb="5" position="relative">
        <Box position="absolute" top="0" right="0" style={{ marginTop: -2 }}>
          <Link href="#card" size="3" onClick={onClickForgotPassword}>
            Forgot password?
          </Link>
        </Box>

        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            Password
          </Text>
          <TextField.Root
            variant="surface"
            type="password"
            placeholder="Enter your password"
            value={password}
            size={"3"}
            onChange={onChangePasswordInner}
          />
        </label>
      </Box>

      <Flex mt="6" justify="end" gap="3" className="flex-col md:flex-row">
        <Button variant="soft" onClick={onClickCreateAccount} size={"3"}>
          Create an account
        </Button>
        <Button variant="solid" onClick={onClickSignIn} size={"3"}>
          Sign in
        </Button>
      </Flex>
    </div>
  );
};
