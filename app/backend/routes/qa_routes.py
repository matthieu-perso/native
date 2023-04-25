'''Router for QA'''

import queue, os
import threading

from fastapi import APIRouter, Request
import traceback, json
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains.chat_vector_db.prompts import CONDENSE_QUESTION_PROMPT, QA_PROMPT
from langchain.chains import ConversationalRetrievalChain
from langchain.vectorstores import Chroma
from starlette.responses import StreamingResponse
from dependencies.chroma_connector import chroma_client
from dependencies.chroma_connector import chroma_client
from logic.llm.model_dependencies import get_model_manager_instance

# We fetch the model currently in use
model_manager = get_model_manager_instance()
embedding = model_manager.embeddings
print("Embedding loaded:", embedding)
print("Model used:", model_manager.model)

print("Current datasource", "")

router = APIRouter()

class ThreadedGenerator:
    def __init__(self):
        self.queue = queue.Queue()

    def __iter__(self):
        return self

    def __next__(self):
        item = self.queue.get()
        if item is StopIteration:
            raise item
        return item

    def send(self, data):
        self.queue.put(data)

    def close(self):
        self.queue.put(StopIteration)


class ChainStreamHandler(StreamingStdOutCallbackHandler):
    def __init__(self, gen):
        super().__init__()
        self.gen = gen

    def on_llm_new_token(self, token: str, **kwargs):
        self.gen.send(token)


def llm_thread(g, query, loaded_collection):
    print("Model manager:",model_manager.model,  type(model_manager.model))

    chat_history = []
    # load the relevant data source 
    vectorstore = Chroma(collection_name=loaded_collection, client=chroma_client, embedding_function=embedding)
    try:
        cienceqa = ConversationalRetrievalChain.from_llm(
            llm=model_manager.model,
            condense_question_prompt=CONDENSE_QUESTION_PROMPT,
            retriever=vectorstore.as_retriever())
        cienceqa({"question": query, "chat_history": chat_history})
    finally:
        g.close()


def chat(prompt, collection):
    g = ThreadedGenerator()
    threading.Thread(target=llm_thread, args=(g, prompt, collection)).start()
    return g

def create_chat_history(messages):
    chat_history = []

    ## We can potentially think of condensing this output.
    print(messages)
    for i in range(len(messages)):
        if messages[i]["role"] == "user":
            query = messages[i]["content"]
            answer = messages[i+1]["content"] if i+1 < len(messages) and messages[i+1]["role"] == "ai" else ""
            chat_history.append((query, answer))
    return chat_history



@router.post("/qa")
async def stream(request: Request):
    try:
        data = await request.json()
        messages = data.get("messages")
        collection = data.get("collection")
        model = data.get("model")

        # Loading the model we received from the frontend
        model_manager.load_model(model)
        chat_history = create_chat_history(messages)
        query = messages[-1].get("content")
        response = StreamingResponse(chat(query, collection), media_type='text/event-stream')
        response.headers.update({
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/event-stream;charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no"
        })
        print(response)
        return response
    except Exception as e:
        print("Exception:", traceback.format_exc())
        token = "Sorry, we've had an issue on our end and didn't get your question. Did you add your documents ?"
        formatted_data = json.dumps(
            {"choices": [{"delta": {"content": token}}]})

        def event_stream():
            yield "data: {}\n\n".format(formatted_data)
        response = StreamingResponse(
            event_stream(), media_type='text/event-stream')
        response.headers.update({
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/event-stream;charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no"
        })
        return response

