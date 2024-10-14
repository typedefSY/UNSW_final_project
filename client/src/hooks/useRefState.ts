import { useEffect, useRef, useState } from "react";

export const useRefState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const ref = useRef<T>(initialState);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref] as const;
};
