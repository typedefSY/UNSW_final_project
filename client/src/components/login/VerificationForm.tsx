import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useCallback } from "react";

interface Props {
  email: string;
  verificationCode: string;
  onChangeVerificationCode: (verificationCode: string) => void;
  onClickBack: () => void;
  onClickVerify: () => void;
}

export const VerificationForm: React.FC<Props> = ({
  email,
  verificationCode,
  onChangeVerificationCode,
  onClickBack,
  onClickVerify,
}) => {
  const onChangeVerificationCodeInner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeVerificationCode(e.currentTarget.value);
    },
    [onChangeVerificationCode],
  );
  return (
    <div>
      <div className="text-2xl font-bold mb-4 text-center lg:text-left">
        Verify your email
      </div>

      <Box mb="5">
        <Text size="3" weight="medium" mb="2" className="text-wrap break-words">
          We have sent a verification code to <strong>{email}</strong>. Please
          check your email and enter the code below.
        </Text>
      </Box>

      <Box mb="5">
        <label>
          <Text as="div" size="3" weight="medium" mb="2">
            Verification code
          </Text>
          <TextField.Root
            variant="surface"
            placeholder="Enter the code"
            value={verificationCode}
            size={"3"}
            onChange={onChangeVerificationCodeInner}
          />
        </label>
      </Box>
      <Flex mt="6" justify="end" gap="3">
        <Button variant="soft" onClick={onClickBack} size="3">
          Back
        </Button>
        <Button variant="solid" onClick={onClickVerify} size="3">
          Verify
        </Button>
      </Flex>
    </div>
  );
};
