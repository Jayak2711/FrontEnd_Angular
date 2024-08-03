import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateBeforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Don't validate if there's no value
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for today's date

    if (inputDate >= today) {
      return { 'dateBeforeToday': true };
    }

    return null;
  };
}
