import logoWhite from "@/assets/logo-white.svg";
import logoColor from "@/assets/logo-color.svg";

import { StaticImageData } from "next/image";

const sizes = {
  xs: "40px",
  small: "50px",
  medium: "100px",
  large: "200px",
};

const variants = {
  white: (logoWhite as StaticImageData).src,
  color: (logoColor as StaticImageData).src,
};

export interface Props extends React.HTMLAttributes<HTMLImageElement> {
  size: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export const Logo: React.FC<Props> = ({ size, variant = "color", ...rest }) => {
  const sizeValue = sizes[size];
  const variantValue = variants[variant];

  return (
    <img
      {...rest}
      src={variantValue}
      alt="logo"
      style={{
        width: sizeValue,
      }}
    />
  );
};
