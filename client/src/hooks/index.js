import { useEffect } from 'react';

export const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
  
    useEffect(() => {
        document.addEventListener("mouseup", handleClick);
    
        return () => {
            document.removeEventListener("mouseup", handleClick);
        };
    }, []);
};