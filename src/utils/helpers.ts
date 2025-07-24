export const formatCurrency = (amount: number | null | undefined, prefix: string = '₩'): string => {
  if (amount === null || amount === undefined) return `${prefix}0`;
  return `${prefix}${Math.abs(amount).toLocaleString()}`;
};

export const formatPercentage = (rate: number | null | undefined, showSign: boolean = true): string => {
  if (rate === null || rate === undefined) return '0%';
  const sign = showSign && rate >= 0 ? '+' : '';
  return `${sign}${rate}%`;
};

export const getProfitColorClass = (value: number): string => {
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-red-400';
  return 'text-slate-400';
};

export const validateTradeData = (entry: string, withdrawal: string, balance: string) => {
  const errors: { [key: string]: string } = {};
  
  const entryNum = parseFloat(entry) || 0;
  const withdrawalNum = parseFloat(withdrawal) || 0;
  const balanceNum = parseFloat(balance);
  
  if (!balance) {
    errors.balance = '잔고를 입력해주세요';
  } else if (balanceNum < 0) {
    errors.balance = '잔고는 양수여야 합니다';
  }
  
  if (entryNum < 0) {
    errors.entry = '입금은 양수여야 합니다';
  }
  
  if (withdrawalNum < 0) {
    errors.withdrawal = '출금은 양수여야 합니다';
  }
  
  return { errors, isValid: Object.keys(errors).length === 0 };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};