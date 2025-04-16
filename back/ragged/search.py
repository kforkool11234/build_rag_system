# search_engine.py

from sentence_transformers import SentenceTransformer
import chromadb
from google import genai
from google.genai import types
# Initialize embedding model and chroma client
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
chroma_client = chromadb.PersistentClient(path="chroma_db")



def semantic_search(query: str,c_name,api,role="chatbot", top_k: int = 5):
    """Search and return original chunks with metadata."""
    query_embedding = embedding_model.encode([query]).tolist()
    # Load the same collection used for storing data
    collection = chroma_client.get_or_create_collection(
        name=c_name,  # Use the exact same name as in your main file
        metadata={"hnsw:space": "cosine"}
    )
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        include=["documents", "metadatas"]
    )
    print(len(results['documents']))
    # return results['documents']
    client = genai.Client(api_key=api)
    q=query+" related to this i will give you certain information take the relavent info and ignore the info you dont think is important and give a perfect answer for you role."
    for i in results['documents']:
        for j in i:
            q+=" "+j
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(
        system_instruction="You are a "+role),
    contents=q
    )
    try:
        text = response.candidates[0].content.parts[0].text
        return text
    except Exception as e:
        print("Error extracting text:", e)
        return None


    
    