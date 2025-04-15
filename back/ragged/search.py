# search_engine.py

from sentence_transformers import SentenceTransformer
import chromadb

# Initialize embedding model and chroma client
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
chroma_client = chromadb.PersistentClient(path="chroma_db")



def semantic_search(query: str,c_name, top_k: int = 7):
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
    return results



    
    