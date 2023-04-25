import Button from '@/components/ui/button';
import ModelList from '@/components/models/list';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { RadioGroup } from '@/components/ui/radio-group';
import { SearchIcon } from '@/components/icons/search';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import axios from "axios";
import DownloadedModelList from '@/components/models/downloaded_list';
interface StatusProps {
  status: string;
  setStatus: (value: string) => void;
}

const customModels = [
  {
    id: "gpt4all",
    lastModified: "2023-04-14",
    downloads: 0,
    type: "Custom",
    license: "N/A",
  },
  {
    id: "llama",
    lastModified: "2023-04-14",
    downloads: 0,
    type: "Custom",
    license: "N/A",
  },
];

interface ModelData {
  id: string;
  author: string;
  lastModified: string;
  pipeline_tag: string;
  downloads: number;
}

interface ModelDetail {
  id: string;
  lastModified: string;
  type: string;
  downloads: number;
  license: string;
}


function Search({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch(searchQuery);
    }
  };
  return (
    <form
      className="relative flex w-full rounded-full lg:w-auto lg:basis-72 xl:w-48"
      noValidate
      role="search"
    >
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          placeholder="Search models"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
        <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </form>
  );
}


function Status({ status, setStatus }: StatusProps) {
  return (
    <RadioGroup
      value={status}
      onChange={setStatus}
      className="flex items-center sm:gap-3"
    >
      <RadioGroup.Option value="Downloaded">
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
            <span className="relative">Loaded</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="public">
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
            <span className="relative">Public</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="Private">
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
            <span className="relative">Private</span>
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}




export default function Models() {
  const [downloadedModels, setDownloadedModels] = useState<ModelDetail[]>([]);
  const [status, setStatus] = useState('Downloaded');
  const { layout } = useLayout();
  const [ModelDetails, setModelDetails] = useState<ModelDetail[]>([]);
  const [modelFolderPath, setModelFolderPath] = useState(null);
  const [downloadingModel, setDownloadingModel] = useState(null);

  const handleModelFolderChange = (event) => {
    const folderPath = event.target.files[0].path;
    setModelFolderPath(folderPath);
  };

  async function downloadModel(modelId) {
    try {
      setDownloadingModel(modelId);
      const response = await axios.post("http://localhost:8000/download_model/", { name: modelId });
      console.log(response.data);
      if (response.status === 200) {
        setDownloadingModel(null);
        fetchDownloadedModels(); // Add this line to refresh the downloaded models list after a successful download
      }
    } catch (error) {
      console.error("Error downloading the model:", error);
      setDownloadingModel(null);
    }
  }

  const fetchDownloadedModels = async () => {
    try {
      const response = await axios.get("http://localhost:8000/list-models");
      setDownloadedModels(response.data);
    } catch (error) {
      console.error("Error fetching downloaded models:", error);
    }
  };



  useEffect(() => {
    fetchSearchedModels();
    fetchDownloadedModels();
  }, []);

  const fetchSearchedModels = async (searchQuery = "") => {
    const baseUrl = "https://huggingface.co/api/models";
    const modelsUrl = `${baseUrl}?sort=downloads&direction=-1&search=${searchQuery}`;
  
    try {
      // Fetch the first 20 models sorted by downloads and based on search query
      const modelsResponse = await fetch(modelsUrl);
      const modelsData = await modelsResponse.json();
      const top20Models = modelsData.slice(0, 20);
  
      const modelDetailsPromises: Promise<ModelDetail | null>[] = top20Models.map(async (model: any) => {
        const modelDetailUrl = `${baseUrl}/${model.modelId}`;
        const modelDetailResponse = await fetch(modelDetailUrl);
        const modelDetailData = await modelDetailResponse.json();
        if (!modelDetailData.id) {
          return null;
        }
        // Check if the lastModified property exists and is a valid date string
        const lastModifiedDate = modelDetailData.lastModified ? new Date(modelDetailData.lastModified) : null;
        const isValidDate = lastModifiedDate && !isNaN(lastModifiedDate.getTime());
  
        // If lastModified is a valid date string, format it as YYYY-MM-DD
        const formattedDate = isValidDate ? lastModifiedDate.toISOString().slice(0, 10) : modelDetailData.lastModified;
        console.log(modelDetailData);
        return {
          id: modelDetailData.id,
          lastModified: formattedDate,
          downloads: modelDetailData.downloads,
          type: modelDetailData.pipeline_tag || 'N/A',
          license: modelDetailData.author || 'N/A',
        };
      });

      const fetchedModelDetails = await Promise.all(modelDetailsPromises);
      setModelDetails([...customModels, ...fetchedModelDetails]);
    } catch (error) {
      console.error('Error fetching Hugging Face models:', error);
    }
  }

  return (
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
          <Search onSearch={(query) => fetchSearchedModels(query)} />
        </div>
      </div>
      {status === 'Downloaded' ? (
        <>
          <div className="mb-3 hidden grid-cols-6 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-8">
            <span className="col-span-4 px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
              Name
            </span>
            <span className="col-span-2 px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
              Downloads
            </span>
            <span className="hidden col-span-2 px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
              Type
            </span>
          </div>


          {downloadedModels && downloadedModels.length > 0 ? (
            downloadedModels.map((model) => (
              <DownloadedModelList
                id={model}
                lastModified={model.lastModified}
                endpoint="http://localhost:8000/delete-models"
              >
              </DownloadedModelList>
            ))
          ) : (
            <div className="flex items-center justify-center mt-20">
              <p className="text-md font-light text-gray-500 dark:text-gray-300">
                No models loaded - download a public one or upload your own!
              </p>
            </div>
          )}

        </>
      ) : null}

      {status === 'public' ? (
        <>

          <div className="mb-3 hidden grid-cols-6 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-8">
            <span className="col-span-4 px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
              Name
            </span>
            <span className="col-span-2 px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
              Downloads
            </span>
            <span className="hidden col-span-2 px-6 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
              Type
            </span>
          </div>


          {ModelDetails && ModelDetails.length > 0 && ModelDetails.filter(model => model !== null).map((model) => (
            <ModelList
              id={model.id}
              lastModified={model.lastModified}
              downloads={model.downloads}
              type={model.type}
            >
              {downloadingModel && (
                <div className="text-center my-4">
                  <p>Downloading model: {downloadingModel}...</p>
                </div>
              )}
              <Button shape="rounded" fullWidth size="large" onClick={() => downloadModel(model.id)}>
                Download Model
              </Button>
            </ModelList>
          ))}
        </>
      ) : null}

      {status === 'Private' ? (
        <>
          <div>
            <label htmlFor="modelFolder" className="mb-2 text-sm tracking-wider text-gray-500 dark:text-gray-300">
              Select the folder where your local model is stored.
            </label>

          </div>
          <div className="flex flex-col w-full mt-4">
            <input
              id="modelFolder"
              type="file"
              webkitdirectory="true"
              mozdirectory="true"
              msdirectory="true"
              odirectory="true"
              directory=""
              className="px-4 py-2 text-sm tracking-wider text-gray-500 dark:text-gray-300 border border-gray-300 rounded-lg dark:bg-light-dark dark:border-gray-600 focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50"
              onChange={handleModelFolderChange}
            />
          </div>

        </>
      ) : null}

    </div>
  )
};