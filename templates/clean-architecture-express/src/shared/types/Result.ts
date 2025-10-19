/**
 * Represents a successful result containing a value.
 */
export class Ok<T> {
  readonly ok: true = true;
  constructor(public readonly value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is never {
    return false;
  }
}

/**
 * Represents a failed result containing an error.
 */
export class Err<E> {
  readonly ok: false = false;
  constructor(public readonly error: E) {}

  isOk(): this is never {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }
}

/**
 * Result type represents either success (Ok) or failure (Err).
 * This is a type-safe alternative to throwing exceptions.
 *
 * @example
 * ```typescript
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) {
 *     return err('Cannot divide by zero');
 *   }
 *   return ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 * if (result.isOk()) {
 *   console.log(result.value); // 5
 * } else {
 *   console.log(result.error); // Error message
 * }
 * ```
 */
export type Result<T, E = string> = Ok<T> | Err<E>;

/**
 * Helper function to create a successful Result.
 */
export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}

/**
 * Helper function to create a failed Result.
 */
export function err<E>(error: E): Err<E> {
  return new Err(error);
}
