import { RequisitesExpression } from './models';

function replaceOperators(expression: string): string {
  return expression
    .replace(/ E /g, 'and')
    .replace(/ OU /g, 'or')
    .replace(/\s/g, '');
}

function isWrappedInSingleParentheses(expression: string): boolean {
  let level = 0;

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') {
      level++;
    }

    if (expression[i] === ')') {
      level--;
    }

    if (level === 0 && i < expression.length - 1) {
      return false;
    }
  }

  return level === 0;
}

function removeSingleParentheses(expression: string): string {
  while (
    expression.startsWith('(') &&
    expression.endsWith(')') &&
    isWrappedInSingleParentheses(expression)
  ) {
    expression = expression.substring(1, expression.length - 1).trim();
  }

  return expression;
}

function containsOperator(expression: string): boolean {
  return expression.includes('and') || expression.includes('or');
}

function isOperatorAt(expression: string, index: number): boolean {
  return (
    expression.slice(index, index + 3) === 'and' ||
    expression.slice(index, index + 2) === 'or'
  );
}

function getOperator(expression: string, index: number): string {
  return expression.slice(index, index + 3) === 'and' ? 'and' : 'or';
}

function splitByOperator(expression: string) {
  let level = 0;
  let currentOperator = '';
  let currentPart = '';
  const parts: string[] = [];

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === '(') {
      if (level > 0) {
        currentPart += char;
      }

      level++;
    } else if (char === ')') {
      level--;

      if (level > 0) {
        currentPart += char;
      }
    } else if (level === 0 && isOperatorAt(expression, i)) {
      currentOperator = getOperator(expression, i);

      if (currentPart.trim()) {
        parts.push(currentPart.trim());
      }

      currentPart = '';
      i += currentOperator.length - 1;
    } else {
      currentPart += char;
    }
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return { parts, operator: currentOperator };
}

function buildExpression(
  parts: RequisitesExpression[],
  operator: string,
): RequisitesExpression {
  if (operator === 'and') {
    return { and: parts };
  } else if (operator === 'or') {
    return { or: parts };
  }

  throw new Error(`Unknown operator: ${operator}`);
}

function parseGroup(expression: string): RequisitesExpression {
  if (!containsOperator(expression)) {
    return expression.trim();
  }

  const { parts, operator } = splitByOperator(expression);
  const parsedParts = parts.map(parseGroup);

  return buildExpression(parsedParts, operator);
}

function parseRaw(expression: string): RequisitesExpression {
  if (!expression || expression.trim() === '-') {
    return null;
  }

  const replacedExpression = replaceOperators(expression);
  const cleanedExpression = removeSingleParentheses(replacedExpression);
  const parsedExpression = parseGroup(cleanedExpression);

  return parsedExpression;
}

function parse(expression: string): RequisitesExpression {
  try {
    return JSON.parse(expression);
  } catch {
    return expression;
  }
}

function stringify(expression: RequisitesExpression) {
  return typeof expression === 'string' || !expression
    ? expression
    : JSON.stringify(expression);
}

function options(expression: RequisitesExpression): string[][] {
  if (!expression) {
    return [];
  }

  if (typeof expression === 'string') {
    return [[expression]];
  }

  if ('and' in expression) {
    return expression.and.reduce<string[][]>(
      (acc, current) => {
        const currentOptions = options(current);

        return acc.flatMap((option) =>
          currentOptions.map((currentOption) => [...option, ...currentOption]),
        );
      },
      [[]],
    );
  }

  if ('or' in expression) {
    return expression.or.flatMap(options);
  }

  throw new Error(`Unknown expression: ${expression}`);
}

const requisites = {
  parse,
  parseRaw,
  stringify,
  options,
};

export default requisites;
