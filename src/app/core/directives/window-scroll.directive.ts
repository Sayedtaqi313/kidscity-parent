import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[windowScroll]',
})
export class ScrollDirective {
  @Output() scrolled = new EventEmitter<boolean>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.pageYOffset > 20;
    this.scrolled.emit(isScrolled);
  }
}
