import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[tcnDropdown]',
  standalone: true
})
export class DropdownDirective implements OnInit {
  @HostListener('document:click', ['$event.target'])
  public onClick(target: HTMLElement): void {
    this.el.nativeElement.contains(target)
      ? this.toggleDropdown()
      : this.closeDropdown();
  }

  @Input('tcnDropdown')
  target!: HTMLElement;

  @Input()
  open = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setDropdownState();
  }

  private toggleDropdown(): void {
    this.open = !this.open;
    this.setDropdownState();
  }

  private closeDropdown(): void {
    if (this.open) {
      this.open = false;
      this.setDropdownState();
    }
  }

  // private setDropdownState(): void {
  //   console.log(this.target);
  //   if (this.target) {
  //     this.renderer.setStyle(this.target, 'display', this.open ? 'block' : 'none');
  //   }
  // }

  private setDropdownState(): void {
    if (!this.target) {
      return;
    }

    if (this.open) {
      Object.entries({
        display: 'block',
        'max-height': '300px',
        opacity: '1',
        overflow: 'hidden',
        transform: 'translateX(-100%)',
        transition: 'max-height 0.4s ease, opacity 0.4s ease'
      }).forEach(([key, value]) =>
        this.renderer.setStyle(this.target, key, value)
      );
    } else {
      Object.entries({
        'max-height': '0',
        opacity: '0',
        overflow: 'hidden'
      }).forEach(([key, value]) =>
        this.renderer.setStyle(this.target, key, value)
      );

      // Use the 'transitionend' event to set display: none after transition completes
      this.renderer.listen(this.target, 'transitionend', () => {
        if (!this.open) {
          this.renderer.setStyle(this.target, 'display', 'none');
        }
      });
    }
  }
}
