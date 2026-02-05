from __future__ import annotations

from typing import List

import pdfplumber


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.
    Returns empty string if no text is found.
    """
    text_parts: List[str] = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            if page_text:
                text_parts.append(page_text)

    return "\n".join(text_parts).strip()
