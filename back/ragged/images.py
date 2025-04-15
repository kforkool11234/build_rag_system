import os
import base64
import cv2
import numpy as np
import chromadb
import easyocr
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.models import Model
from io import BytesIO
from PIL import Image

# Load MobileNetV2 model for feature extraction
base_model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")
model = Model(inputs=base_model.input, outputs=base_model.output)

# Initialize OCR
reader = easyocr.Reader(['en'])

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")  


def compress_base64(img):
    """Compress image and convert to base64."""
    img = Image.fromarray(img)
    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=20, optimize=True)  # Compress image
    return base64.b64encode(buffer.getvalue()).decode()

def extract_text(img):
    """Extract text from an image using EasyOCR."""
    results = reader.readtext(img)
    return " ".join([text[1] for text in results])  # Extract detected text

def get_image_embedding(img_path):
    """Extract feature embedding from image."""
    img = keras_image.load_img(img_path, target_size=(224, 224))
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    
    embedding = model.predict(img_array)
    return embedding.flatten().tolist()

def process_and_store_image(img_path,c_id):
    collection = chroma_client.get_or_create_collection(name=c_id)
    """Process a single image and store embeddings, text, and base64 in ChromaDB."""
    if not os.path.exists(img_path):
        print(f"Error: File '{img_path}' not found.")
        return

    img = cv2.imread(img_path)
    img_name = os.path.basename(img_path)

    # Extract features
    embedding = get_image_embedding(img_path)

    # OCR
    extracted_text = extract_text(img)

    # Convert & compress base64
    base64_img = compress_base64(img)

    # Store in ChromaDB
    collection.add(
    ids=[img_name],
    embeddings=[embedding],
    documents=["Image placeholder"],  # Optional: could leave empty or descriptive
    metadatas=[{
        "type": "image",
        "filename": img_name,
        "text": extracted_text,
        "base64_img": base64_img  # ✅ Store base64 here
    }]
)


    print(f"Stored: {img_name} -> Embedding, OCR Text, Base64 (as document)")
def image(img_path,c_id):
    # Process the single image
    process_and_store_image(img_path,c_id)

    print("✅ Image processed and stored in ChromaDB.")
