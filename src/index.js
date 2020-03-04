function parseCalculationString(s) {
  s = s
    .split(" ")
    .filter(el => el !== "")
    .join("");
  let calculation = [],
    current = "";
  for (let i = 0, ch; (ch = s.charAt(i)); i++) {
    if ("*/+-".indexOf(ch) > -1) {
      if (current == "" && ch == "-") {
        current = "-";
      } else {
        calculation.push(parseFloat(current), ch);
        current = "";
      }
    } else {
      current += s.charAt(i);
    }
  }
  if (current != "") {
    calculation.push(parseFloat(current));
  }
  return calculation;
}

function calcExpr(calc) {
  let ops = [
      {
        "*": function(a, b) {
          return a * b;
        },
        "/": function(a, b) {
          if (b !== 0) {
            return a / b;
          } else {
            throw new Error("TypeError: Division by zero.");
          }
        }
      },
      {
        "+": function(a, b) {
          return a + b;
        },
        "-": function(a, b) {
          return a - b;
        }
      }
    ],
    newCalc = [],
    currentOp;
  for (let i = 0; i < ops.length; i++) {
    for (let j = 0; j < calc.length; j++) {
      if (ops[i][calc[j]]) {
        currentOp = ops[i][calc[j]];
      } else if (currentOp) {
        newCalc[newCalc.length - 1] = currentOp(
          newCalc[newCalc.length - 1],
          calc[j]
        );
        currentOp = null;
      } else {
        newCalc.push(calc[j]);
      }
    }
    calc = newCalc;
    newCalc = [];
  }
  if (calc.length === 1) {
    return parseFloat(calc[0]);
  } else {
    throw new Error("ExpressionError: Expression cannot be calculated");
  }
}

function calcBracketsExpr(expr) {
  let exprInBrackets = expr.match(/\(([^()]+)\)/);
  let resultExprBrackets = calcExpr(parseCalculationString(exprInBrackets[1]));
  return expr.replace(exprInBrackets[0], resultExprBrackets);
}

function checkBrackets(str) {
  let stack = [];
  let map = {
    "(": ")"
  };

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(") {
      stack.push(str[i]);
    } else {
      let last = stack.pop();
      if (str[i] !== map[last]) {
        throw new Error("ExpressionError: Brackets must be paired");
      }
    }
  }
  if (stack.length !== 0) {
    throw new Error("ExpressionError: Brackets must be paired");
  }

  return true;
}

function expressionCalculator(expr) {
  let brackets = expr
    .split("")
    .filter(el => el === "(" || el === ")")
    .join("");

  if (brackets.length) {
    checkBrackets(brackets);
    return expressionCalculator(calcBracketsExpr(expr));
  } else {
    return calcExpr(parseCalculationString(expr));
  }
}

module.exports = {
  expressionCalculator
};
