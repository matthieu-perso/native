
import os, json
import torch
from langchain.callbacks.base import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])


# create custom embeddings based on our current model
def create_embeddings(input_text: str, tokenizer, model) -> torch.Tensor:
    encoded_input = tokenizer(input_text, return_tensors='pt')

    with torch.no_grad():
        outputs = model(**encoded_input)

    embeddings = outputs.last_hidden_state
    sentence_embedding = torch.mean(embeddings, dim=1)

    return sentence_embedding


def load_huggingface_embeddings():
    from langchain.embeddings import HuggingFaceEmbeddings
    model_name = "sentence-transformers/all-mpnet-base-v2"
    return HuggingFaceEmbeddings(model_name=model_name)


class ModelManager:
    def __init__(self):
        self.model = None
        self.embeddings = None

    def is_text_based_model(self, model_path: str):
        config_path = os.path.join(model_path, "config.json")
        if not os.path.exists(config_path):
            return False

        with open(config_path, "r") as config_file:
            config_data = json.load(config_file)
        
        return "Perceiver" not in config_data.get("model_type", "")

    def load_model(self, model_type: str):
        # replace the -- from Huggingface
        model_type = model_type.replace("--", "").lower()
        if model_type == "gpt4all":
            from langchain.llms import GPT4All
            self.model = GPT4All(model="./dependencies/models_cache/Gpt4All/ggml-model-f16.bin", n_ctx=2048, n_threads=8, callback_manager=callback_manager, verbose=True)
        elif model_type == "llama_cpp":
            from langchain.llms import LlamaCpp
            self.model = LlamaCpp(model_path="./ggml-model-q4_0.bin")
        else:
            print("Model type", model_type)
            from langchain.llms import HuggingFacePipeline
            self.model = HuggingFacePipeline.from_model_id(model_id=model_type, task="text-generation")
        print("Model loaded",   self.model, type(self.model))

    def load_embeddings(self):
        self.embeddings = load_huggingface_embeddings()

