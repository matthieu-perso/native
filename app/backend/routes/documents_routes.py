
import requests, os
import itertools
from typing import List, Optional
from fastapi import APIRouter, Request
from transformers import PreTrainedModel, AutoModel
from pydantic import BaseModel
from fastapi import FastAPI, Request, Form, File, UploadFile
from dependencies.chroma_connector import chroma_client
from langchain.vectorstores import Chroma
from logic.llm.model_dependencies import get_model_manager_instance
from dependencies.data_loaders import file_loader, url_loader

class ModelId(BaseModel):
    model_id: str

router = APIRouter()


model_manager = get_model_manager_instance()
llm = model_manager.model
embedding = model_manager.embeddings


@router.get("/list-collection")
async def list_collection():
    collections = chroma_client.list_collections()
    print(collections)
    return [collection.name for collection in collections]


@router.post("/delete-collection")
async def delete_collection(model: ModelId):
    print("Deleting collection:", model)
    chroma_client.delete_collection(model.model_id)
    return {f"Collection {model.model_id} deleted."}


@router.post("/add-collection")
async def add_collection(
    name: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    urls: Optional[List[str]] = Form(None)
):
    docs = []

    if files:
        docs.extend(file_loader(file) for file in files)

    if urls:
        docs.extend(url_loader(url) for url in urls)

    # vectorstore is a specific Chroma collection

    persist_directory = os.environ.get("CHROMA_DIRECTORY", "dependencies/db")

        # Init 
    embedding = get_model_manager_instance().embeddings

    # add texts 
    collection = Chroma(name.lower(), embedding_function=embedding,  persist_directory=persist_directory, client=chroma_client)
    collection.add_documents(docs[0])

    return {"message" : "Collection created."}