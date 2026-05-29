#!/usr/bin/env python3
"""Read a CSV file and print the top 5 rows.

Usage:
    python read_csv_top5.py path/to/file.csv

The script will read the CSV file using the csv module and output the
first five rows (including the header if present). It handles
commas, quotes, and other common CSV nuances.
"""

import csv
import sys
import argparse


def main():
    parser = argparse.ArgumentParser(description="Print the top 5 rows of a CSV file.")
    parser.add_argument("csv_file", help="Path to the CSV file to read")
    args = parser.parse_args()

    try:
        with open(args.csv_file, newline='', encoding='utf-8') as f:
            reader = csv.reader(f)
            # Read the header if present
            header = next(reader, None)
            rows = []
            for i, row in enumerate(reader):
                if i >= 5:
                    break
                rows.append(row)
    except FileNotFoundError:
        print(f"Error: File not found: {args.csv_file}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading CSV file: {e}", file=sys.stderr)
        sys.exit(1)

    # Print header and rows
    if header:
        print(",".join(header))
    for row in rows:
        print(",".join(row))


if __name__ == "__main__":
    main()
