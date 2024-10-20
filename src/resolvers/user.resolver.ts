import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const userResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params };
  return inject(UserService).profile(params.userId);
};
