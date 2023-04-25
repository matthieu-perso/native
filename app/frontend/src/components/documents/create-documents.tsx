import { useState, useEffect } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import Button from '@/components/ui/button';
import Input from '@/components/ui/forms/input';
import Uploader from '@/components/ui/forms/uploader';
import InputLabel from '@/components/ui/input-label';
import { motion } from 'framer-motion';
import ModelList from '@/components/models/list';
import ActiveLink from '@/components/ui/links/active-link';
import routes from '@/config/routes';
import axios from 'axios';
import DownloadedModelList from '@/components/models/downloaded_list';
import cn from 'classnames';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';


interface Plugin {
  id: string;
  name: string;
  avatar: string;
  description: string;
}

interface StatusProps {
  status: string;
  setStatus: (value: string) => void;
}


function Status({ status, setStatus }: StatusProps) {
  return (
    <RadioGroup
      value={status}
      onChange={setStatus}
      className="flex items-center sm:gap-3"
    >
      <RadioGroup.Option value="Load">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${checked ? 'text-white' : 'text-brand dark:text-white/50'
              }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">Load</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="Create">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${checked ? 'text-white' : 'text-brand dark:text-white/50'
              }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">Create</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="Plugins">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${checked ? 'text-white' : 'text-brand dark:text-white/50'
              }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">Plugins</span>
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

export default function CreateDocuments() {
  const [status, setStatus] = useState('Load');
  const [collectedData, setCollectedData] = useState({ urls: [], files: [] });
  const [inputUrl, setInputUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [list, setList] = useState([]);
  const [inputName, setInputName] = useState("");
  const { layout } = useLayout();


  async function fetchList() {
    try {
      const response = await axios.get('http://localhost:8000/list-collection');
      setList(response.data);
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  }


  useEffect(() => {
    if (status === 'Load') {
      fetchList();
    }
  }, [status]);

  function handleAddUrl() {
    if (inputUrl) {
      setCollectedData((prevData) => ({
        ...prevData,
        urls: [...prevData.urls, inputUrl],
      }));
      setInputUrl("");
    }
  }

  function handleAddFiles(newFiles) {
    setCollectedData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...newFiles],
    }));
  }









  async function handleCreate() {
    // Call the API to send the collected data (URLs and files)
    const response = await sendCollectedData(collectedData);
    // log collected data
    console.log("Collected data:", collectedData);

    if (response) {
      console.log("Data sent successfully:", response);

      // Reset collectedData and inputName after successful submission
      setCollectedData({ urls: [], files: [] });
      setInputName("");
    } else {
      console.error("Error sending data");
    }
  }

  function handleNameChange(event) {
    setInputName(event.target.value);
  }

  async function sendCollectedData(data) {
    const formData = new FormData();
    formData.append('name', inputName);

    data.files.forEach((file) => {
      formData.append('files', file);
    });

    data.urls.forEach((url, index) => {
      formData.append(`urls`, url);
    });

    for (const [key, value] of formData.entries()) {
      console.log(`Current values ${key}: ${value}`);
    }

    console.log(formData)

    try {
      const response = await axios.post('http://localhost:8000/add-collection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Request sent")
      return response.data;
    } catch (error) {
      console.error('Error sending collected data:', error);
      return null;
    }
  }


  return (
    <>
      <div className="mx-auto w-full">
        <div
          className={cn(
            'mb-6 flex flex-col justify-between gap-4',
            layout === LAYOUT_OPTIONS.RETRO
              ? 'lg:flex-row lg:items-center lg:gap-6'
              : 'md:flex-row md:items-center md:gap-6'
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <Status status={status} setStatus={setStatus} />
            <div
              className={cn(
                layout === LAYOUT_OPTIONS.RETRO ? 'lg:hidden' : 'md:hidden'
              )}
            >
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 lg:gap-8">
            <div
              className={cn(
                'hidden shrink-0 ',
                layout === LAYOUT_OPTIONS.RETRO ? 'lg:block' : 'md:block'
              )}
            >
            </div>
          </div>
        </div>
        {status === 'Load' ? (
          <>
            <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-4">
              <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">Name</span>
              <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">Author</span>
              <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">Downloads</span>
              <span className="hidden px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">Type</span>
            </div>
            {list && list.length > 0 ? (
              list.map((model) => (
                <DownloadedModelList id={model} lastModified={model.lastModified} endpoint="http://localhost:8000/delete-collection"></DownloadedModelList>
              ))
            ) : (
              <div className="flex items-center justify-center mt-20">
                <p className="text-md font-light text-gray-500 dark:text-gray-300">
                  You don't have any documents loaded. Create a collection or add a plugin.
                </p>
              </div>
            )}
          </>
        ) : null}


        {status === 'Create' && (
          <div>
            <div className="mb-8">
              <InputLabel title="Name" important />
              <Input
                type="text"
                placeholder="Enter item name"
                value={inputName}
                onChange={handleNameChange}
              />
            </div>
            <div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {/* Current Documents */}
                {(collectedData.files.length > 0 || collectedData.urls.length > 0) && (
                  <div className="mb-8">
                    <InputLabel title="Current Documents" />
                    <ul>
                      {collectedData.files.map((file) => (
                        <li key={file.name}>{file.name}</li>
                      ))}
                      {collectedData.urls.map((url) => (
                        <li key={url}>{url}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* File uploader */}
                <div className="mb-8">
                  <InputLabel title="Upload file" />
                  <Uploader onFilesUploaded={setUploadedFiles} handleAddFiles={handleAddFiles} />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <InputLabel title="Add Url" />
              <Input
                type="text"
                placeholder="Enter item URL"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddUrl();
                  }
                }}
              />
            </div>
            <div className="mb-8">
              <Button shape="rounded" onClick={handleCreate}>
                Create collection
              </Button>
            </div>
          </div>
        )}

        {status === 'Plugins' && (
          <>
            <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-4">
              <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
                Name
              </span>
              <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
                Author
              </span>
              <span className="px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
                Downloads
              </span>
              <span className="hidden px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
                Modified
              </span>
            </div>

            {typeof PluginDetails !== 'undefined' && PluginDetails && PluginDetails.length > 0 ? (
              PluginDetails.map((plugin) => (
                <ModelList
                  id={plugin.id}
                  lastModified={plugin.lastModified}
                  downloads={plugin.downloads}
                  description={plugin.description}
                  paid={plugin.paid}
                  license={plugin.license}
                >
                  <ActiveLink href={routes.models}>
                    <Button shape="rounded" fullWidth size="large">
                      Load to task
                    </Button>
                  </ActiveLink>
                </ModelList>
              ))
            ) : (
              <div className="flex items-center justify-center mt-20">
                <p className="text-md font-light text-gray-500 dark:text-gray-300">
                  Plugins are coming soon. Interact with external apps and dataflow from Native 🔥
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

