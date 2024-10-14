import { Logo } from "./Logo";

export const CenteredLoading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full absolute left-0 top-0">
      <Logo size="small" className="animate-pulse" />
    </div>
  );
};
