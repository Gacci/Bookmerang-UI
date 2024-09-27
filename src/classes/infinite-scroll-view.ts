import { Data } from "@angular/router";

export abstract class InfiniteScrollView<T> {
    protected data: T[] = [];

    protected pageNumber: number = 1;
  
    protected pageSize: number = 50;
  
    protected isLoadingNext: boolean = false;
  
    protected hasNextPage: boolean = true;
  
    protected params: Data = {};


    abstract onScrollDown(): void;
    
    abstract onScrollUp(): void;
}
