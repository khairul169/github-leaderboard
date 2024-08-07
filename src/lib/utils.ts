import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...args: any[]) => {
  return twMerge(clsx(...args));
};

export const dummyAvatar = (id = 1) => {
  return `https://avatar.iran.liara.run/public/${id}`;
};
