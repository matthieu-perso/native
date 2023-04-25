"""Connector class to interact with local Chroma instance"""

import chromadb, os
from chromadb.config import Settings
from langchain.vectorstores import Chroma

# import the default embedding function
from logic.llm.model_dependencies import get_model_manager_instance



chroma_client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=os.environ.get("CHROMA_DIRECTORY", "dependencies/db")
            ))


"""
# Creating the DB 
persist_directory = os.environ.get("CHROMA_DIRECTORY", "dependencies/db")
print("Chroma directory:", persist_directory)

# Init 
embedding = get_model_manager_instance().embeddings

# add texts 
vectorstore = Chroma("testing12", embedding_function=embedding,  persist_directory=persist_directory)
print("Chroma vectorstore created:", vectorstore)
print(vectorstore._client.list_collections())
 
chroma_client

Chroma()

"""

