import requisites from './parser';

describe('requisites parser', () => {
  test('parseRaw should return null for empty or "-" expression', () => {
    expect(requisites.parseRaw('')).toBeNull();
    expect(requisites.parseRaw('-')).toBeNull();
  });

  test('parseRaw should replace operators and remove single parentheses', () => {
    const expression = '(A E B) OU C';
    const expected = { or: [{ and: ['A', 'B'] }, 'C'] };
    expect(requisites.parseRaw(expression)).toEqual(expected);
  });

  test('parse should return parsed JSON for valid JSON string', () => {
    const expression = '{"and":["A","B"]}';
    const expected = { and: ['A', 'B'] };
    expect(requisites.parse(expression)).toEqual(expected);
  });

  test('parse should return the original string for invalid JSON string', () => {
    const expression = 'invalid';
    expect(requisites.parse(expression)).toBe(expression);
  });

  test('stringify should return JSON string for object', () => {
    const expression = { and: ['A', 'B'] };
    const expected = '{"and":["A","B"]}';
    expect(requisites.stringify(expression)).toBe(expected);
  });

  test('stringify should return the original string for string input', () => {
    const expression = 'A';
    expect(requisites.stringify(expression)).toBe(expression);
  });

  test('options should return all combinations for "and" operator', () => {
    const expression = { and: ['A', 'B'] };
    const expected = [['A', 'B']];
    expect(requisites.options(expression)).toEqual(expected);
  });

  test('options should return all options for "or" operator', () => {
    const expression = { or: ['A', 'B'] };
    const expected = [['A'], ['B']];
    expect(requisites.options(expression)).toEqual(expected);
  });

  test('options should return empty array for null input', () => {
    expect(requisites.options(null)).toEqual([]);
  });
});