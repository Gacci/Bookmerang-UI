import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { InstitutionService } from '../../services/institution.service';

import { Unsubscribable } from '../../classes/unsubscribable';
import { DialogRef } from '@ngneat/dialog';
import { Data } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'institutions-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './institutions-dialog.component.html',
  styleUrl: './institutions-dialog.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstitutionsDialogComponent
  extends Unsubscribable
  implements AfterViewInit, OnDestroy
{
  private auth = inject(AuthService);
  private service = inject(InstitutionService);

  
  // private cdr = inject(ChangeDetectorRef);

  protected ref: DialogRef<Data> = inject(DialogRef);

  protected preferredSearchScope!: number;

  protected isLoading!: boolean;

  protected institutions: any[] = [];

  ngAfterViewInit() {
    const { institutions } = this.auth.getJwtToken();
    if (!!institutions?.length) {
      this.isLoading = true;

      forkJoin(
        institutions.map((institution: number) =>
          this.service.read(institution)
        )
      )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(institutions => {
          this.isLoading = false;
          this.institutions = <Array<any>>institutions;
        });
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
