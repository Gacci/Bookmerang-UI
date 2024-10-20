import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tcnDropdown]',
  standalone: true,
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


  constructor(private el: ElementRef, private renderer: Renderer2) {}

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
      this.renderer.setStyle(this.target, 'display', 'block'); // Show the dropdown


      this.renderer.setStyle(this.target, 'max-height', '300px'); // Set max-height
      this.renderer.setStyle(this.target, 'opacity', '1'); // Full opacity
      this.renderer.setStyle(this.target, 'overflow', 'hidden'); // Hide overflow
      this.renderer.setStyle(this.target, 'transition', 'max-height 0.4s ease, opacity 0.4s ease');
    } else {
      // Set styles to initiate the closing transition
      this.renderer.setStyle(this.target, 'max-height', '0'); // Collapsed height
      this.renderer.setStyle(this.target, 'opacity', '0'); // Hidden opacity
      this.renderer.setStyle(this.target, 'overflow', 'hidden'); // Hide overflow

      // Use the 'transitionend' event to set display: none after transition completes
      this.renderer.listen(this.target, 'transitionend', () => {
        if (!this.open) {
          this.renderer.setStyle(this.target, 'display', 'none'); // Hide after transition completes
        }
      });
    }
  }
}
