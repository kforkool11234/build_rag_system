import os
from .text import text
from .images import image
from .audio import audio
import tempfile
def s_vec(uploaded_file,c_id):
    # Save to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[1]) as temp_file:
        for chunk in uploaded_file.chunks():
            temp_file.write(chunk)
        temp_file_path = temp_file.name

    # Determine file type and process
    file_extension = uploaded_file.name.split('.')[-1].lower()

    if file_extension in ['txt', 'md', 'csv', 'pdf', 'pptx']:
        text(temp_file_path,c_id)
    elif file_extension in ['jpg', 'jpeg', 'png', 'gif', 'bmp']:
        image(temp_file_path,c_id)
    elif file_extension in ['mp3', 'wav', 'aac', 'flac']:
        audio(temp_file_path,c_id)
    else:
        print(f"Unsupported file type: {uploaded_file.name}")