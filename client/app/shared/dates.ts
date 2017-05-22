export class Dates {
  static addDays(date: Date, days: number) {
    let newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  static getDatePart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static max(a: Date, b: Date) {
    return Dates.getDatePart(a) > Dates.getDatePart(b) ? a : b;
  }

  static getNextDayOfWeekAfter(startDateExclusive: Date, dayOfWeek: number) {
    let nextDate = Dates.addDays(startDateExclusive, 1);

    if(nextDate.getDay() == dayOfWeek) {
      return nextDate;
    }

    let daysToAdd = dayOfWeek - nextDate.getDay();
    if(daysToAdd < 0) {
      daysToAdd += 7;
    }

    return Dates.addDays(nextDate, daysToAdd);    
  }
}