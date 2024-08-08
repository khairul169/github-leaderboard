import { useEffect, useState } from "react";

export const setHashUrl = (value: string) => {
  history.replaceState(undefined, undefined as never, "#" + value);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

export const useHashUrl = () => {
  const [value, setValue] = useState(location.hash.substring(1));

  useEffect(() => {
    const onHashChange = () => {
      setValue(location.hash.substring(1));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return value;
};
