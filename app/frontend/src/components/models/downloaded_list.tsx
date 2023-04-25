import { useState } from 'react';
import { XIcon } from '@heroicons/react/solid';

interface DownloadedModelListProps {
  id: string;
  lastModified: string;
  license: string;
  endpoint: string; // Add the endpoint prop here
}

export default function DownloadedModelList({
  id,
  lastModified,
  children,
  endpoint, // Destructure the endpoint prop here
}: React.PropsWithChildren<DownloadedModelListProps>) {
  let [isExpand, setIsExpand] = useState(false);

  const deleteModel = async (id) => {
    console.log('Deleting model:', id);
    try {
      const response = await fetch(endpoint, {
        // Use the endpoint prop here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model_id: id }),
      });

      if (!response.ok) {
        throw new Error(`Error deleting model: ${response.statusText}`);
      }

      // Refresh the model list or handle successful deletion as needed
      window.location.reload(); // Add this line to refresh the page
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  return (
    <div className="relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark">
<div
  className="relative grid h-auto cursor-pointer grid-cols-4 items-center gap-3 py-4 sm:h-20 sm:grid-cols-6 sm:gap-6 sm:py-0"
  onClick={() => setIsExpand(!isExpand)}
>

        <div className="truncate px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            Name
          </span>
          {id}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            Last Modified
          </span>
          {lastModified}
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <XIcon
          className="h-5 w-5 cursor-pointer text-gray-500 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            deleteModel(id);
          }}
        />
      </div>
    </div>
  );
}
