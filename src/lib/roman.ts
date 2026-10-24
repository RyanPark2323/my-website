const ROMAN_TABLE: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** Converts a positive integer into an upper-case Roman numeral string. */
export function toRoman(value: number): string {
  let n = Math.max(1, Math.floor(value));
  let out = '';
  for (const [amount, numeral] of ROMAN_TABLE) {
    while (n >= amount) {
      out += numeral;
      n -= amount;
    }
  }
  return out;
}
