import React, { useState } from "react";
import { Avatar as BaseAvatar } from "react-daisyui";

type Props = React.ComponentPropsWithoutRef<typeof BaseAvatar> & {
  fallback?: string;
};

const Avatar = ({ src, fallback, ...props }: Props) => {
  const [isError, setError] = useState(false);

  return (
    <BaseAvatar
      {...props}
      src={isError && (fallback || !src) ? fallback : src}
      onError={() => setError(true)}
    />
  );
};

export default Avatar;
