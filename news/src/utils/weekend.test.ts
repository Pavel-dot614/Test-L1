import { isWeekend } from './weekend';

describe('isWeekend', () => {
  const weekendDay = 'Сегодня выходной';
  const workingDay = 'Сегодня будний день';

  it(`should return ${weekendDay} for Sunday`, () => {
    jest.spyOn(Date.prototype, 'getDay').mockImplementation(() => 0);
    expect(isWeekend()).toBe(weekendDay);
  });

  it('should return "Сегодня выходной" for Saturday', () => {
    jest.spyOn(Date.prototype, 'getDay').mockImplementation(() => 6);
    expect(isWeekend()).toBe(weekendDay);
  });

  it(`should return ${workingDay} for Monday`, () => {
    jest.spyOn(Date.prototype, 'getDay').mockImplementation(() => 1);
    expect(isWeekend()).toBe(workingDay);
  });

  it('should return "Сегодня будний день" for Friday', () => {
    jest.spyOn(Date.prototype, 'getDay').mockImplementation(() => 5);
    expect(isWeekend()).toBe(workingDay);
  });
});
