"""
scripts/experiences/links-to-xlsx.py

Exports links.csv → links.xlsx for Elena to fill in: frozen header row,
new_url column highlighted, plus a "How to fill" sheet.

Needs openpyxl (NOT a repo dependency; use a throwaway venv):
    python3 -m venv /tmp/xl && /tmp/xl/bin/pip install openpyxl
    /tmp/xl/bin/python scripts/experiences/links-to-xlsx.py

links.csv stays the source the apply script reads; the xlsx is only a
friendlier way to edit. Save it back as CSV (UTF-8) over links.csv, or tell
Claude to read links.xlsx.
"""

import csv
import os

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(HERE, "links.csv"), newline="", encoding="utf-8") as f:
    rows = list(csv.reader(f))
header, body = rows[0], rows[1:]

wb = Workbook()
ws = wb.active
ws.title = "links"
ws.append(header)
for r in body:
    ws.append(r)

ws.freeze_panes = "A2"
ws.auto_filter.ref = f"A1:{get_column_letter(len(header))}{len(body) + 1}"

HEAD_FILL = PatternFill("solid", fgColor="0F3A33")
NEW_FILL = PatternFill("solid", fgColor="FFF2A8")
NEW_HEAD_FILL = PatternFill("solid", fgColor="F2C200")
STATUS_FILL = {
    "ok": PatternFill("solid", fgColor="E4EFEC"),
    "review": PatternFill("solid", fgColor="FBD9D3"),
    "no_gyg": PatternFill("solid", fgColor="EDE7E1"),
}

col = {name: i + 1 for i, name in enumerate(header)}
for c in range(1, len(header) + 1):
    cell = ws.cell(row=1, column=c)
    cell.font = Font(bold=True, color="FFFFFF")
    cell.fill = HEAD_FILL
    cell.alignment = Alignment(vertical="center")

# new_url (and notes) are the columns Elena edits
ws.cell(row=1, column=col["new_url"]).fill = NEW_HEAD_FILL
ws.cell(row=1, column=col["new_url"]).font = Font(bold=True, color="000000")
for r in range(2, len(body) + 2):
    ws.cell(row=r, column=col["new_url"]).fill = NEW_FILL
    s = ws.cell(row=r, column=col["status"])
    if s.value in STATUS_FILL:
        s.fill = STATUS_FILL[s.value]

widths = {
    "id": 34, "guide": 22, "region": 13, "es_name": 34, "en_name": 34, "category": 12,
    "current_url": 48, "current_type": 14, "resolved_gyg_url": 48, "status": 9,
    "new_url": 52, "notes": 30,
}
for name, w in widths.items():
    ws.column_dimensions[get_column_letter(col[name])].width = w

help_ws = wb.create_sheet("How to fill")
for line in [
    "Fill the new_url column (yellow). One row per experience; ES and EN both get the result.",
    "",
    "  A full GYG tour URL (…-t12345/)  → becomes the link",
    "  keep                              → keep resolved_gyg_url if present, otherwise current_url unchanged",
    "  (blank)                           → no change to that experience",
    "  remove                            → the link becomes empty (no button)",
    "  any other URL (OpenTable, venue)  → written as-is",
    "",
    "status:  ok = GYG tour page  |  review = GYG page that is not a tour, or redirect failed  |  no_gyg = not GetYourGuide",
    "A new_url on getyourguide.com that is not a tour page (-t<number>/) will be refused by the apply script.",
    "GYG links are stored as the plain tour URL (no query params); partner_id and cmp are added at render time.",
]:
    help_ws.append([line])
help_ws.column_dimensions["A"].width = 120

wb.save(os.path.join(HERE, "links.xlsx"))
print(f"links.xlsx: {len(body)} rows, header frozen, new_url highlighted")
