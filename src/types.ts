export type BigNumberData = string | number;

export interface BigNumberFormatOptions{
  /**
   * Use comma as separator between integer and decimal part
   */
  comma?: boolean;

  /**
   * Number of characters decimal part will split.
   * - If `true`, decimal part keep all characters passed.
   * - If `false`, decimal part is skip.
   */
  decimal?: number | boolean;

  /**
   * Trim the separator character if decimal part is not exist.
   */
  trim?: boolean;
}