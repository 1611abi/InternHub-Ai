import io
import PyPDF2

def parse_resume(file_bytes):
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text.strip()
    except Exception as e:
        # Fallback to raw decode if text/txt
        try:
            return file_bytes.decode('utf-8')
        except:
            raise ValueError("Unable to parse file. Please upload a valid PDF or Text file.")
