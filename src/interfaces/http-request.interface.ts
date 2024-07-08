export interface HttpRequest<T = any> {
  sent?: boolean;
  done?: boolean;
  bad?: boolean;
  ok?: boolean;
  body?: T;
}
