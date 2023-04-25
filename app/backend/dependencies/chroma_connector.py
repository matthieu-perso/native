"""Connector class to interact with local Chroma instance"""

import chromadb, os
from chromadb.config import Settings

# import the default embedding function
from logic.llm.model_dependencies import get_model_manager_instance


chroma_client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=os.environ.get("CHROMA_DIRECTORY", "dependencies/db")
            ))

