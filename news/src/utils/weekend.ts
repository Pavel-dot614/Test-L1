export const isWeekend = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'Сегодня выходной';
  } else {
    return 'Сегодня будний день';
  }
};
