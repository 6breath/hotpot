import dayjs from 'dayjs';

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式化模板,默认 'YYYY-MM-DD HH:mm:ss'
 */
export const formatDateTime = (date?: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 */
export const formatDate = (date?: string | Date): string => {
  return formatDateTime(date, 'YYYY-MM-DD');
};

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数,默认2位
 */
export const formatMoney = (amount?: number, decimals = 2): string => {
  if (amount === undefined || amount === null) return '0.00';
  return amount.toFixed(decimals);
};

/**
 * 格式化数字,添加千分位
 * @param num 数字
 */
export const formatNumber = (num?: number): string => {
  if (num === undefined || num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间(ms)
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param delay 延迟时间(ms)
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
};

/**
 * 下载文件
 * @param url 文件URL
 * @param filename 文件名
 */
export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export const copyToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text);
};
