export const CHINESE_MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月', 
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export function getArchiveLabel(year: string, month: string) {
  const monthIdx = parseInt(month, 10) - 1;
  return `${CHINESE_MONTHS[monthIdx]} ${year}`;
}

// Ensure the date string is handled carefully usually 'YYYY-MM-DD'
export function parseDate(dateStr: string) {
  const [year, month] = dateStr.split('-');
  return { year, month };
}

export function getLatestTwoYearsRange() {
  const now = new Date();
  const endYear = now.getFullYear();
  const startYear = endYear - 2;
  return { startYear, endYear };
}

export function getLatestOneYearRange() {
  const now = new Date();
  const endYear = now.getFullYear();
  const startYear = endYear - 1;
  return { startYear, endYear };
}
