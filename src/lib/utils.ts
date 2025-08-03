import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[] | K
) => {
  const clone = { ...obj };
  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      delete clone[key];
    });
  } else {
    delete clone[keys];
  }
  return clone;
};

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256); // 0–255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};
