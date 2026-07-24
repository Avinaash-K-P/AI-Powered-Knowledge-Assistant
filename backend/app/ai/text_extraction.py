from pathlib import Path
from docx import Document as DocxDocument
from pypdf import PdfReader

def extract_text(file_path:str) -> str:
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)
    
    if extension == ".docx":
        return extract_docx_text(file_path)

    if extension == ".txt":
        return extract_txt_text(file_path)

    raise ValueError ("Unsupported file type")    
        

def extract_pdf_text(file_path:str) -> str:
    reader = PdfReader(file_path)
    pages =[]

    for page in reader.pages:
        text = page.extract_text() or ""
        if text.strip():
            pages.append(text)

    return "/n".join(pages)

def extract_docx_text(file_path:str) -> str:
    document = DocxDocument(file_path)

    paragraphs = [
        paragraph.text.strip()
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "/n".join(paragraphs)

def extract_txt_text(file_path:str) -> str:
    with open(file_path, "r", encoding = "utf-8") as file:
        return file.read()