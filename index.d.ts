declare module 'envvar' {
  /**
   * Returns the value of the specified environment variable as a string.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   */
  export function string(name: string, defaultValue?: string): string;

  /**
   * Returns the value of the specified environment variable as a number.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   * @throws if the value of the environment variable does not represent a
   *         number.
   */
  export function number(name: string, defaultValue?: number): number;

  /**
   * Returns the value of the specified environment variable as a boolean.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   * @throws if the value of the environment variable does not represent a
   *         boolean.
   */
  export function boolean(name: string, defaultValue?: boolean): boolean;

  /**
   * Returns the value of the specified environment variable, provided that
   * the value is one of the permissible strings.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   * @throws if the value of the environment variable is not one of the
   *         permissible strings.
   */
  export function oneOf(name: string, allowedValues: Array<string>, defaultValue?: string): string;
}
