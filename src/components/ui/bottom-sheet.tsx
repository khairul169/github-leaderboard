import { cn } from "@client/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { Drawer } from "vaul";

type BottomSheetProps = ComponentPropsWithoutRef<typeof Drawer.Root> & {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const BottomSheet = ({
  trigger,
  children,
  className,
  ...props
}: BottomSheetProps) => {
  return (
    <Drawer.Root {...props}>
      {trigger ? <Drawer.Trigger asChild>{trigger}</Drawer.Trigger> : null}

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9]" />
        <Drawer.Content
          className={cn(
            "flex flex-col bg-base-100 rounded-t-2xl mt-24 h-[60%] max-h-[96%] fixed z-10 bottom-0 left-0 right-0 md:mx-auto md:max-w-3xl focus:outline-none",
            className
          )}
        >
          <Drawer.Handle className="bg-neutral my-2" />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const BottomSheetTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Drawer.Title>) => {
  return <Drawer.Title className={cn("text-2xl", className)} {...props} />;
};

export const BottomSheetDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Drawer.Description>) => {
  return <Drawer.Description className={className} {...props} />;
};

export default BottomSheet;
