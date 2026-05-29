"""Simple calculator module.

Provides basic arithmetic operations: add, subtract, multiply, divide.
"""

from __future__ import annotations


def add(a: float | int, b: float | int) -> float:
    """Return the sum of *a* and *b*.

    Parameters
    ----------
    a, b : int | float
        Operands.

    Returns
    -------
    float
        The result of a + b.
    """
    return a + b


def subtract(a: float | int, b: float | int) -> float:
    """Return the difference of *a* and *b* (a - b)."""
    return a - b


def multiply(a: float | int, b: float | int) -> float:
    """Return the product of *a* and *b*.

    Parameters
    ----------
    a, b : int | float

    Returns
    -------
    float
        The result of a * b.
    """
    return a * b


def divide(a: float | int, b: float | int) -> float:
    """Return the quotient of *a* divided by *b*.

    Raises
    ------
    ZeroDivisionError
        If *b* is zero.
    """
    if b == 0:
        raise ZeroDivisionError("division by zero")
    return a / b

# If run as a script, demonstrate usage.
if __name__ == "__main__":
    import sys

    ops = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
    }
    if len(sys.argv) != 4:
        print("Usage: calculator.py <op> <a> <b>")
        sys.exit(1)
    op, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
    try:
        result = ops[op](a, b)
    except ZeroDivisionError as e:
        print(e)
        sys.exit(1)
    print(result)
