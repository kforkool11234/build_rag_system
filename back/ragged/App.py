import os
from .text import text
from .images import image
from .audio import audio
import tempfile
import os
import shutil

def s_vec(uploaded_file, c_id):
    # Create a temp directory
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, uploaded_file.name)

    # Save the uploaded file to the temp path with original name
    with open(temp_file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    # Determine file type and process
    file_extension = uploaded_file.name.split('.')[-1].lower()

    if file_extension in ['txt', 'md', 'csv', 'pdf', 'pptx']:
        text(temp_file_path, c_id)
    elif file_extension in ['jpg', 'jpeg', 'png', 'gif', 'bmp']:
        image(temp_file_path, c_id)
    elif file_extension in ['mp3', 'wav', 'aac', 'flac']:
        audio(temp_file_path, c_id)
    else:
        print(f"Unsupported file type: {uploaded_file.name}")
    shutil.rmtree(temp_dir)
