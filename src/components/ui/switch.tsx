import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "xs" | "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors duration-200 ease-out outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-8 data-[size=default]:w-16 data-[size=default]:px-0.5 data-[size=sm]:h-6 data-[size=sm]:w-11 data-[size=sm]:px-px data-[size=xs]:h-5 data-[size=xs]:w-9 data-[size=xs]:px-px dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-zinc-600 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.2)] ring-0 transition-transform duration-200 ease-out motion-reduce:transition-none group-data-[size=default]/switch:h-6 group-data-[size=default]/switch:w-9 group-data-[size=sm]/switch:h-5 group-data-[size=sm]/switch:w-6 group-data-[size=xs]/switch:h-4 group-data-[size=xs]/switch:w-5 data-unchecked:translate-x-0 group-data-[size=default]/switch:data-checked:translate-x-5.5 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=xs]/switch:data-checked:translate-x-3"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
