import { catchError, map, of, pipe, startWith } from 'rxjs';

export function loading() {
  return pipe(
    map(() => false),
    startWith(true),
    catchError(() => of(false))
  );
}
