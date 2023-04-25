import subprocess, os
from transformers import pipeline
from transformers import AutoModel, AutoTokenizer


def download_llama_model():
    subprocess.call(['pip', 'install', 'pyllamacpp'])
    from langchain.llms import GPT4All
    return GPT4All(model="./dependencies/models_cache/Gpt4All/gpt4all-lora-quantized-ggml.bin")

def download_gpt4all_model():
    subprocess.call(['pip', 'install', 'llama-cpp-python'])
    from langchain.llms import LlamaCpp
    return LlamaCpp(model_path="./ggml-model-q4_0.bin")

def load_hf_model(name:str)
    from langchain import  HuggingFaceHub
    return HuggingFaceHub(repo_id=name, model_kwargs={"temperature":0})


def load_custom_model(path_to_model:str):
    from langchain.llms import HuggingFacePipeline

    tokenizer = AutoTokenizer.from_pretrained(path_to_model)
    model = AutoModel.from_pretrained(path_to_model)
    pipe = pipeline(
        "text-generation", model=model, tokenizer=tokenizer, max_new_tokens=10
    )
    return HuggingFacePipeline(pipeline=pipe)