import whisper
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from .text import process_file  # Import process_file from text.py
from .text import store_in_chroma

def transcribe_audio(audio_file):
    """Transcribes an audio file using Whisper ASR."""
    model = whisper.load_model("base")  # Choose from "tiny", "small", "medium", "large"
    result = model.transcribe(audio_file)
    return result["text"]

def generate_pdf(text):
    """Generates a PDF from text and returns it as a BytesIO object."""
    pdf_buffer = BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    width, height = letter
    c.setFont("Helvetica", 12)

    margin = 50
    y_position = height - margin
    line_height = 15
    for line in text.split('\n'):
        if y_position <= margin:  # Start new page if needed
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = height - margin
        c.drawString(margin, y_position, line)
        y_position -= line_height

    c.save()
    pdf_buffer.seek(0)  # Reset buffer pointer
    return pdf_buffer

def audio(audio_path,c_id):
    print("Transcribing audio...")
    transcript = transcribe_audio(audio_path)

    print("Generating PDF from transcript...")
    pdf_buffer = generate_pdf(transcript)

    # Save the generated PDF to disk so that process_file (from text.py) can work with it
    temp_pdf_path = "transcription.pdf"
    with open(temp_pdf_path, "wb") as f:
        f.write(pdf_buffer.getvalue())
    print(f"PDF saved as {temp_pdf_path}")

    # Now, import and use the file processing function from text.py
    chunks, filename = process_file(temp_pdf_path)
    print(f"Extracted {len(chunks)} text chunks from {filename}")
    store_in_chroma(c_id,chunks, filename, mode="full")