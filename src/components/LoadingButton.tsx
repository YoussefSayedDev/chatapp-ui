import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FC } from "react";
import { Button, ButtonProps } from "./ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

const LoadingButton: FC<LoadingButtonProps> = ({
  loading,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className='size-5 animate-spin' />}
      {props.children}
    </Button>
  );
};

export default LoadingButton;
