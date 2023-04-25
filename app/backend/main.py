import os, traceback
import logging
import uvicorn
from routes import documents_routes, qa_routes, models_routes
from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


# Create a logger object
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Create a handler to write log messages to a file
handler = logging.FileHandler("debug.log")
handler.setLevel(logging.DEBUG)

# Create a formatter to format log messages
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)

# Add the handler to the logger object
logger.addHandler(handler)



app = FastAPI(
    title="Native",
)

app = FastAPI()

app.include_router(documents_routes.router, tags=["Documents"])
app.include_router(models_routes.router, tags=["Models"])
app.include_router(qa_routes.router,  tags=["QA"])

# Add CORS middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    print("Native server starting !")


if __name__ == "__main__":
    print("Starting...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")


