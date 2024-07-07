import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


import SwiperCore from 'swiper';
import { A11y, EffectFade, Keyboard } from 'swiper/modules';
import { Swiper, SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';



SwiperCore.use([]);
@Component({
  selector: 'app-password-recovery-start',
  standalone: true,
  templateUrl: './password-recovery-start.component.html',
  styleUrl: './password-recovery-start.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PasswordRecoveryStartComponent {
  // @ViewChild('swiper') swiperEl!: ElementRef<Swiper>;
  //   swiper!: ElementRef<Swiper>;

  @ViewChild('swiper', { read: ElementRef<SwiperContainer> }) swiper!: ElementRef<SwiperContainer>


  // codeInputMask = createMask('* * * * * *');
  config: SwiperOptions = {
    modules: [A11y, EffectFade, Keyboard],
    allowTouchMove: false, // Disable swiping
    simulateTouch: false, // Disable dragging
    autoHeight: true,
    effect: 'fade',
    keyboard: { enabled: false, onlyInViewport: true },
    noSwipingClass: 'no-swipe',
    noSwiping: true,
    shortSwipes: false,
    longSwipes: false,
    allowSlideNext: false,
    allowSlidePrev: false
  };

  protected expiresInSeconds: number = 60;
  protected timerExpiredId: any;

  protected startPasswordRecovery: FormGroup = new FormGroup({
    email: new FormControl(null, [ Validators.email ])
  });

  constructor() {
    
  }

  runExpiresInCountdown() {
    this.expiresInSeconds = 60;
    if (this.timerExpiredId) {
      clearInterval(this.timerExpiredId);
    }

    this.timerExpiredId = setInterval(() => {
      this.expiresInSeconds--;
      if (this.expiresInSeconds <= 0) {
        clearInterval(this.timerExpiredId);
      }
    }, 1000);
  }

  onSubmitStartRecovery() {
    if (this.startPasswordRecovery.invalid) {
      return;
    }



    const elem = <any>this.swiper.nativeElement;

    console.log(elem.swiper.slideTo(1))
    this.runExpiresInCountdown();
  }
}
