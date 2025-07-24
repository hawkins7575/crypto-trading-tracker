import { useCallback } from 'react';

const useSimpleLog = () => {
  const log = useCallback((message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  return { log };
};

export default useSimpleLog;
