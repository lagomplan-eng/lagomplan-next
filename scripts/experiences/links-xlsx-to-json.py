"""
scripts/experiences/links-xlsx-to-json.py

Reads the "links" sheet of links.xlsx and prints it as a JSON array of
{column: text} objects on stdout. Used by apply-links.ts so Elena can edit the
xlsx directly (no re-saving as CSV). Read-only; never writes the workbook.

Needs openpyxl (not a repo dependency):
    python3 -m venv /tmp/xl && /tmp/xl/bin/pip install openpyxl
    XL_PYTHON=/tmp/xl/bin/python npx tsx scripts/experiences/apply-links.ts --check
"""

import json
import sys

from openpyxl import load_workbook

if len(sys.argv) != 2:
    sys.exit("usage: links-xlsx-to-json.py <links.xlsx>")

wb = load_workbook(sys.argv[1], read_only=True, data_only=True)
if "links" not in wb.sheetnames:
    sys.exit(f'no sheet named "links" (found: {wb.sheetnames})')

rows = list(wb["links"].iter_rows(values_only=True))
header = [str(h).strip() if h is not None else "" for h in rows[0]]
out = []
for r in rows[1:]:
    if not any(c not in (None, "") for c in r):
        continue
    out.append({header[i]: ("" if c is None else str(c).strip()) for i, c in enumerate(r) if header[i]})

json.dump(out, sys.stdout, ensure_ascii=False)
