import { useEffect, useState } from "react";

export default function useMediaQuery(mediaQueryString: string): boolean | null {
    const [matches, setMatches] = useState<boolean | null>(null);
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const mediaQueryList = window.matchMedia(mediaQueryString);
        const listener = () => setMatches(!!mediaQueryList.matches);
        listener();
        mediaQueryList.addEventListener("change", listener);
        return () => mediaQueryList.removeEventListener("change", listener);
      }
    }, [mediaQueryString]);
  
    return matches;
  }