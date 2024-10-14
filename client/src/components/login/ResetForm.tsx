import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useCallback } from "react";

interface Props {
  email: string;
  onChangeEmail: (email: string) => void;
  password: string;
  onChangePassword: (password: string) => void;

  onClickBack: () => void;
  onClickSendResetEmail: () => void;
}

export const ResetForm: React.FC<Props> = ({
  email,
  onChangeEmail,
  password,
  onChangePassword,
  onClickBack,
  onClickSendResetEmail,
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
        Reset password
      </div>

      <Box mb="5">
        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            Email address
          </Text>
          <TextField.Root
            variant="surface"
            placeholder="Enter your email"
            value={email}
            size={"3"}
            onChange={onChangeEmailInner}
          />
        </label>
      </Box>

      <Box mb="5" position="relative">
        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            Password
          </Text>
          <TextField.Root
            variant="surface"
            type="password"
            placeholder="Enter your new password"
            value={password}
            size={"3"}
            onChange={onChangePasswordInner}
          />
        </label>
      </Box>

      <Flex mt="6" justify="end" gap="3" className="flex-col md:flex-row">
        <Button variant="soft" onClick={onClickBack} size={"3"}>
          Back
        </Button>
        <Button variant="solid" onClick={onClickSendResetEmail} size={"3"}>
          Confirm
        </Button>
      </Flex>
    </div>
  );
};
