export interface HttpRequest<T = void> {
  sent?: boolean;
  done?: boolean;
  bad?: boolean;
  ok?: boolean;
  body?: T;
}
