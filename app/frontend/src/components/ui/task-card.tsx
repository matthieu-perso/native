import { Verified } from '@/components/icons/verified';

type TaskGridProps = {
  name: string ,
  author: string,
  description: string,
  model: string,
  input: string,
  link: string,
};

export default function TaskGrid({
  name,
  author,
  description,
  model,
  input,
  link,
}: TaskGridProps) {
  const navigateToLink = () => {
    window.location.href = link;
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-lg dark:bg-light-dark"
      onClick={navigateToLink}
      style={{ cursor: 'pointer' }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            <span className="overflow-hidden text-ellipsis">@{author}</span>
          </span>
        </div>
        <span className="block mb-4 text-xl font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
          {name}
        </span>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{model}</span>
            <Verified className="ltr:ml-1 rtl:mr-1 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
