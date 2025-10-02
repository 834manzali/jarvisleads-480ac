"use client";

import * as React from "react";
import { cn } from "./utils";

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-nunito",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
