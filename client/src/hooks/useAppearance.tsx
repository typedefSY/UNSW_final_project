import { useEffect, useState } from "react";

export type Appearance = "light" | "dark";

const calculateDesiredAppearance = (): Appearance => {
  const isDarkMode = !!window.matchMedia("(prefers-color-scheme: dark)")
    .matches;

  const desiredAppearance = isDarkMode ? "dark" : "light";

  return desiredAppearance;
};

// Automatically switch between light and dark themes based on user's system preferences
export const useAppearance = (): Appearance => {
  const [appearance, setAppearance] = useState<Appearance>("light");

  useEffect(() => {
    const update = () => {
      const desiredAppearance = calculateDesiredAppearance();

      if (appearance !== desiredAppearance) {
        setAppearance(desiredAppearance);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, [appearance]);

  return appearance;
};
