# search_engine.py
import torch
from sentence_transformers import SentenceTransformer
import chromadb
from google import genai
from google.genai import types
import open_clip
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
embedding_model, _, tokenizer = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
embedding_model = embedding_model.to(device)
chroma_client = chromadb.PersistentClient(path="chroma_db")



def semantic_search(query: str, c_name, api, role="chatbot", top_k: int = 5):
    with torch.no_grad():
        tokens = open_clip.tokenize([query]).to(device)
        query_embedding = embedding_model.encode_text(tokens)
        query_embedding = query_embedding / query_embedding.norm(dim=-1, keepdim=True)
        query_embedding = query_embedding.cpu().tolist()

    collection = chroma_client.get_or_create_collection(
        name=c_name,
        metadata={"hnsw:space": "cosine"}
    )

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        include=["documents", "metadatas"]
    )

    client = genai.Client(api_key=api)
    q = query + " related to this i will give you certain information take the relavent info and ignore the info you dont think is important and give a perfect answer for you role."
    for i in results['documents']:
        for j in i:
            q += " " + j

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(system_instruction=f"You are a {role}"),
        contents=q
    )

    try:
        return response.candidates[0].content.parts[0].text
    except Exception as e:
        print("Error extracting text:", e)
        return None
