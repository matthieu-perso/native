'''Managing model across the app'''
import os, glob
from logic.llm.model_manager import ModelManager
from transformers import pipeline
from langchain.llms import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer


_model_manager = None


def get_model_manager():
    global _model_manager
    if _model_manager is None:
        _model_manager = ModelManager()
    return _model_manager

def get_model_manager_instance():
    return get_model_manager()


def load_default_model():
    model_cache_directory = "dependencies/models_cache"
    list_of_models = glob.glob(f"{model_cache_directory}/*")
    if list_of_models:
        #pmodel = max(list_of_models, key=os.path.getctime)
        pmodel = "bert-base-uncased"
        get_model_manager().load_model(pmodel)
        get_model_manager().load_embeddings()
    else:
        # Handle the case where there are no models
        print("No models found in cache directory. Loading default model...")

# Call the function to load the default model when the script starts
load_default_model()
