import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbers]',
})
export class OnlyNumbersDirective {
  private lastValue = '';
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const regex = new RegExp(/^[0-9]*$/);
    if (!value.match(regex)) {
      this.ngControl.control?.patchValue(this.lastValue);
      return;
    }

    this.lastValue = value;
  }
}
