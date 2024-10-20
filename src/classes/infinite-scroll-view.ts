import { Data } from '@angular/router';
import { Unsubscribable } from './unsubscribable';

export abstract class InfiniteScrollView<T> extends Unsubscribable {
  protected data: T[] = [];

  protected pageNumber: number = 1;

  protected pageSize: number = 50;

  protected isLoadingNext: boolean = false;

  protected hasNextPage: boolean = true;

  protected params: any = {};

  abstract onScrollDown(): void;

  abstract onScrollUp(): void;
}
