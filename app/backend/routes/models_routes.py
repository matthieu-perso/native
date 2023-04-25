
import os
import shutil
import requests
from fastapi import APIRouter, HTTPException
from transformers import PreTrainedModel, AutoModel
from pydantic import BaseModel
import torch, subprocess, os
from transformers import  GenerationConfig, pipeline
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from logic.llm.model_dependencies import get_model_manager_instance

router = APIRouter()

class ModelName(BaseModel):
    name: str

class ModelId(BaseModel):
    model_id: str



model_manager = get_model_manager_instance()
llm = model_manager.model
embedding = model_manager.embeddings


cache_directory = "dependencies/models_cache"
os.environ["TRANSFORMERS_CACHE"] = "dependencies/models_cache"

def download_gpt4all_model():
    url = "https://the-eye.eu/public/AI/models/nomic-ai/gpt4all/gpt4all-lora-quantized-ggml.bin"
    filename = "gpt4all-lora-quantized-ggml.bin"
    response = requests.get(url)
    with open(f"./models-cache/Gpt4All/{filename}", "wb") as f:
        f.write(response.content)
    from langchain.llms import GPT4All
    return GPT4All(model="./models-cache/Gpt4All/gpt4all-lora-quantized-ggml.bin", n_ctx=512, n_threads=8)

def download_llama_model():
    print("Downloading Llama model")
    from langchain.llms import LlamaCpp
    return LlamaCpp(model_path="./ggml-model-q4_0.bin")


def load_hf_model(name:str):
    from langchain import  HuggingFaceHub
    return HuggingFaceHub(repo_id=name, model_kwargs={"temperature":0})


def load_custom_model(path_to_model:str):
    from langchain.llms import HuggingFacePipeline
    from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

    tokenizer = AutoTokenizer.from_pretrained(path_to_model)
    model = AutoModelForCausalLM.from_pretrained(path_to_model)
    pipe = pipeline(
        "text-generation", model=model, tokenizer=tokenizer, max_new_tokens=10
    )
    return HuggingFacePipeline(pipeline=pipe)



@router.post("/download_model/")
async def download_model(model_name: ModelName):
    print("Downloading model:", model_name.name)
    try:
        if model_name.name == "llama":
            model = download_llama_model()
        elif model_name.name == "gpt4all":
            model = download_gpt4all_model()
        elif model_name.name == "hf":
            model = load_hf_model(model_name.name)
        elif model_name.name == "custom":
            if model_name.custom_path:
                model = load_custom_model(model_name.custom_path)
            else:
                raise ValueError("Custom model requires a valid path to the model")
        else:
            raise ValueError("Invalid model name provided")

        return {"message": f"Model {model_name.name} downloaded successfully"}
    except Exception as e:
        return {"message": str(e)}

        

@router.get("/list-models/")
async def list_models():
    """List all models in cache"""
    cache_dir = "dependencies/models_cache"
    directories = [d.replace("models--", "") for d in os.listdir(cache_dir) if os.path.isdir(os.path.join(cache_dir, d))]    
    return directories



@router.post("/set-model")
async def set_model(model_name: ModelName):
    model_manager = get_model_manager_instance()
    model_manager.load_model(model_name.name.lower())
    return {"message": f"Model {model_name.name} is now being used."}


@router.post("/delete-models")
async def delete_models(model: ModelId):
    model_id = model.model_id
    cache_dir = "dependencies/models_cache"
    if model_id in ("Gpt4All", "LLama"):
        model_directory = os.path.join(cache_dir, model_id)
    else:
        model_directory = os.path.join(cache_dir, f"models--{model_id}")
    print(model_directory)
    if not os.path.isdir(model_directory):
        raise HTTPException(status_code=404, detail="Model not found")

    try:
        print(f"Deleting model {model_id} from cache")
        shutil.rmtree(model_directory)
    except Exception as e:
        print("Error:", e)  # Add this line
        raise HTTPException(status_code=500, detail=f"Error deleting model: {e}")

    return {"status": "success", "message": "Model deleted successfully"}