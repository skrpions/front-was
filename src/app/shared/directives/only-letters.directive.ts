import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyLetters]',
})
export class OnlyLettersDirective {
  private lastValue = '';
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    const regex = new RegExp(/^[a-zA-Z| ÁÉÍÓÚáéíóúüÜÑñ]+$/);
    if ((!value.match(regex) && value !== '') || value === ' ') {
      this.ngControl.control?.patchValue(this.lastValue);
      return;
    }

    this.lastValue = value;
  }
}
