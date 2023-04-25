'''Interact with the APIs. 

Relevant if the user wants to use commercial models.
'''
from langchain.chat_models import ChatOpenAI
from langchain.callbacks import CallbackManager, StreamingStdOutCallbackHandler

def load_open_ai():
    llm = ChatOpenAI(
        verbose=True,
        streaming=True,
        callback_manager=CallbackManager([ChainStreamHandler(g)]),
        temperature=0)
    return llm

### API Keys                    

#API_KEY = os.environ['OPENAI_API_KEY']
#llm = OpenAI(temperature=0, openai_api_key=API_KEY)