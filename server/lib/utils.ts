//

export const intval = (value: any) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  const num = parseInt(value);
  return Number.isNaN(num) ? 0 : num;
};
