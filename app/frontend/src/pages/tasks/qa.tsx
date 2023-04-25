import type { NextPageWithLayout } from '@/types';
import { useState, useRef, useEffect, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Listbox, { ListboxOption } from '@/components/ui/list-box';
import { PlusIcon } from '@heroicons/react/solid';
import RootLayout from '@/layouts/_root-layout';


function MessageHuman({ message }) {
  return (
    <div className="group w-full border-b border-black/10 text-gray-800 dark:border-gray-900/50 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex space-x-4 py-4 text-base md:space-x-6 md:py-6">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-gray-300 p-1 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div className="min-h-[20px] whitespace-pre-wrap">{message}</div>
      </div>
    </div>
  );
}


const MessageBot = forwardRef(({ message, hidden }, ref) => {
  return (
    <div className={`${hidden ? "hidden" : "block"} group w-full border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100`}>
      <div className="flex space-x-4 py-4 text-base md:space-x-6 md:py-6">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-gray-800 p-1 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
          </svg>
        </div>
        <div className="min-h-[20px] whitespace-pre-wrap">
          <div className="break-words">
            <p ref={ref} className={ref && !hidden ? "after:-mb-1 after:inline-block after:h-5 after:w-2 after:animate-blink after:bg-gray-600 after:content-[''] after:dark:bg-gray-400" : ""}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

async function setModel(modelName) {
  console.log('Setting model to', modelName);
  try {
    const response = await fetch('http://localhost:8000/set-model/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName.name }),
    });

    if (!response.ok) {
      throw new Error('An error occurred');
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error setting the model:', error);
  }
}


async function getAIResponse(model, collection, query) {
  const body = JSON.stringify({
    messages: [{ role: "user", content: query }],
    model,
    collection,
  });

  try {
    const response = await fetch('http://localhost:8000/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      throw new Error('An error occurred');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let responseContent = ""; // Initialize an empty string to accumulate the response content

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const content = decoder.decode(value);
      responseContent += content; // Accumulate the content into responseContent
    }

    return responseContent; // Return the accumulated response content
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw new Error('An error occurred');
  }
}


function ActionFields({ modelType, setModelType, documentType, setDocumentType, modelOptions, documentOptions, onModelChange }) {
  const router = useRouter();

  // Handle redirection on clicking ADD button
  const handleAddModel = () => {
    router.push('/model');
  };

  const handleAddDocument = () => {
    router.push('/documents');
  };

  useEffect(() => {
    if (onModelChange) {
      onModelChange(modelType);
    }
  }, [modelType, onModelChange]);

  return (
    <div className="">
      <div className="group mb-4 rounded-md bg-gray-100/90 p-5 pt-3 dark:bg-dark/60 xs:p-6 xs:pb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <p className="dark:text-gray-300">Model</p>
            <Listbox
              className="w-full max-w-full text-black sm:w-80"
              options={modelOptions}
              selectedOption={modelType}
              onChange={setModelType}
              onAdd={handleAddModel} // Pass the handleAddModel function

            />
          </div>
          <div>
            <p className="dark:text-gray-300">Documents</p>
            <Listbox
              className="w-full max-w-full text-black sm:w-80"
              options={documentOptions}
              selectedOption={documentType}
              onChange={setDocumentType}
              onAdd={handleAddDocument}

            />
          </div>
        </div>
      </div>
    </div>
  );
}


const CreateProposalPage: NextPageWithLayout = () => {
  const [modelOptions, setModelOptions] = useState([]);
  const [documentOptions, setDocumentOptions] = useState([]);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [aiResponded, setAiResponded] = useState(false);
  const chatContainerRef = useRef(null);
  let [modelType, setModelType] = useState(modelOptions[0]);
  let [documentType, setDocumentType] = useState(documentOptions[0]);



  useEffect(() => {
    const fetchModelOptions = async () => {
      const response = await fetch('http://localhost:8000/list-models/');
      const models = await response.json();
      console.log('Models:', models); // Add this line to log the models

      const modelOptions = models.map((model) => ({ name: model, value: model }));
      setModelOptions(modelOptions);
    };

    const fetchDocumentOptions = async () => {
      const response = await fetch('http://localhost:8000/list-collection');
      const collections = await response.json();
      console.log('Collections:', collections); // Add this line to log the models
      const documentOptions = collections.map((collection) => ({ name: collection, value: collection }));
      setDocumentOptions(documentOptions);
    };

    fetchModelOptions();
    fetchDocumentOptions();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text, isUser) => {
    setMessages([...messages, { text, isUser }]);
  };

  const onUserMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    setAiResponded(false);
    getAIResponse(modelType.value, documentType.value, text)
      .then((response) => {
        if (response) {
          setMessages((prevMessages) => [...prevMessages, { text: response, isUser: false }]);
        }
        setAiResponded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <>
      <NextSeo
        title="Qa"
        description="Native - QA task"
      />
      <section className="mx-auto w-full max-w-[1160px] text-sm">
        <div className="mb-6 rounded-lg bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-large dark:bg-light-dark xs:p-6 xs:pb-8">
          <h3 className="mb-2 text-base font-medium dark:text-gray-100 xl:text-lg">
            Question and Answer
          </h3>
          <p className="mb-5 leading-[1.8] dark:text-gray-300">
            Choose your documents, your model and start asking questions!
          </p>
          <ActionFields
            modelType={modelType}
            setModelType={setModelType}
            documentType={documentType}
            setDocumentType={setDocumentType}
            modelOptions={modelOptions}
            documentOptions={documentOptions}
            onModelChange={setModel}
          />
          {messages && (
            <main className="relative flex w-full flex-col items-center overflow-hidden pb-6 text-sm md:pb-12">
              {messages.map((message, index) =>
                message.isUser ? (
                  <MessageHuman key={index} message={message.text} />
                ) : (
                  <MessageBot key={index} message={message.text} />
                )
              )}
            </main>
          )}
          <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            <textarea
              tabIndex={0}
              rows={1}
              placeholder="Ask your question here !"
              onKeyUp={(e) => {
                const textarea = e.target as HTMLTextAreaElement
                if (e.key === "Enter" && !e.shiftKey) {
                  onUserMessage(e.target.value);
                  e.target.value = "";
                } else {
                  textarea.style.height = "auto" // Reset the height to its default to allow it to shrink when deleting text
                  textarea.style.height = `${textarea.scrollHeight}px` // Set the height to the scroll height so that it expands on new lines
                }
              }}
              className="max-h-52 h-6 overflow-y-hidden m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"

            />
            <button
              type="submit"
              className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                className="h-4 w-4 rotate-90"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

CreateProposalPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default CreateProposalPage;

