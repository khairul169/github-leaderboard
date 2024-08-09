import React, { useState } from "react";

type Props = React.ComponentPropsWithoutRef<"img"> & {
  fallback?: string;
};

const Image = ({ src, fallback, ...props }: Props) => {
  const [isError, setError] = useState(false);

  return (
    <img
      {...props}
      src={isError && (fallback || !src) ? fallback : src}
      onError={() => setError(true)}
    />
  );
};

export default Image;
