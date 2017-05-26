export class DateString {
  constructor(
    private year: number,
    private month: number,
    private day: number
  ) {
  }

  addDays(days: number): DateString {
    let date = this.toDate();
    date.setDate(date.getDate() + days);
    return DateString.fromDate(date);
  }

  isOnOrAfter(other: DateString): boolean {
    return this.toDate() >= other.toDate(); 
  }

  isAfter(other: DateString): boolean {
    return this.toDate() > other.toDate(); 
  }

  isOnOrBefore(other: DateString): boolean {
    return this.toDate() <= other.toDate(); 
  }

  isBefore(other: DateString): boolean {
    return this.toDate() < other.toDate(); 
  }

  getNextDayOfWeek(dayOfWeek: number): DateString {
    let nextDate = this.addDays(1);
    let nextDayOfWeek = nextDate.toDate().getDay();

    if(nextDayOfWeek == dayOfWeek) {
      return nextDate;
    }

    let daysToAdd = dayOfWeek - nextDayOfWeek;
    if(daysToAdd < 0) {
      daysToAdd += 7;
    }

    return nextDate.addDays(daysToAdd);    
  }

  toDate(): Date {
    return new Date(this.year, this.month - 1, this.day, 12);
  }

  toString(): string {
    let y = '' + this.year;
    let m = '' + this.month;
    if(m.length == 1) {
      m = '0' + m;
    }
    let d = '' + this.day;
    if(d.length == 1) {
      d = '0' + d;
    }

    return `${y}-${m}-${d}`;
  }

  static today(): DateString {
    return DateString.fromDate(new Date());
  }
  
  static max(a: DateString, b: DateString) {
    return a.isAfter(b) ? a : b;
  }

  static fromDate(date: Date): DateString {
    return new DateString(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  static fromJSONString(json: string): DateString {
    if(!json) {
      return null;
    }
    return DateString.fromDate(new Date(json));
  }
}

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