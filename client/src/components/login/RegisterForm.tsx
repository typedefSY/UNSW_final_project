import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useCallback } from "react";

interface Props {
  firstName: string;
  onChangeFirstName: (firstName: string) => void;
  lastName: string;
  onChangeLastName: (lastName: string) => void;
  email: string;
  onChangeEmail: (email: string) => void;
  password: string;
  onChangePassword: (password: string) => void;

  onClickRegisterConfirm: () => void;
  onClickBack: () => void;
}

export const RegisterForm: React.FC<Props> = ({
  firstName,
  onChangeFirstName,
  lastName,
  onChangeLastName,
  email,
  onChangeEmail,
  password,
  onChangePassword,
  onClickRegisterConfirm,
  onClickBack,
}) => {
  const onChangeFirstNameInner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFirstName(e.currentTarget.value);
    },
    [onChangeFirstName],
  );

  const onChangeLastNameInner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeLastName(e.currentTarget.value);
    },
    [onChangeLastName],
  );
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
        Register
      </div>

      <Box mb="5">
        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            First name
          </Text>
          <TextField.Root
            variant="surface"
            placeholder="Enter your first name"
            value={firstName}
            size={"3"}
            onChange={onChangeFirstNameInner}
          />
        </label>
      </Box>

      <Box mb="5">
        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            Last name
          </Text>
          <TextField.Root
            variant="surface"
            placeholder="Enter your last name"
            value={lastName}
            size={"3"}
            onChange={onChangeLastNameInner}
          />
        </label>
      </Box>

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
            placeholder="Enter your password"
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
        <Button variant="solid" onClick={onClickRegisterConfirm} size={"3"}>
          Create
        </Button>
      </Flex>
    </div>
  );
};
