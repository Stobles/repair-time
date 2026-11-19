import {
  ArrowRight,
  Calculator,
  PhoneCall,
  SendHorizontal,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const icons = {
  "arrow-right": { component: ArrowRight, width: 16, height: 16 },
  calculator: { component: Calculator, width: 12, height: 12 },
  phone: { component: PhoneCall, width: 12, height: 12 },
  send: { component: SendHorizontal, width: 15, height: 12 },
};

type IconName = keyof typeof icons;
type IconProps = Omit<
  LucideProps,
  "name" | "children" | "size" | "width" | "height"
> & {
  name: IconName;
};

function Icon({ name, className, ...props }: IconProps) {
  const { component: Symbol, width, height } = icons[name];

  return (
    <Symbol
      aria-hidden="true"
      focusable="false"
      {...props}
      width={width}
      height={height}
      className={cn("shrink-0", className)}
    />
  );
}

export { Icon, type IconName, type IconProps };
