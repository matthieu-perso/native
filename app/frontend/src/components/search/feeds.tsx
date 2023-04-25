import cn from 'classnames';
import { TaskList } from '@/data/static/task-list';
import TaskGrid from '@/components/ui/task-card';
import { useGridSwitcher } from '@/lib/hooks/use-grid-switcher';

export default function Feeds({ className }: { className?: string }) {
  const { isGridCompact } = useGridSwitcher();
  return (
    <div
      className={cn(
        'grid gap-5 sm:grid-cols-2 md:grid-cols-3',
        isGridCompact
          ? '3xl:!grid-cols-4 4xl:!grid-cols-5'
          : '3xl:!grid-cols-3 4xl:!grid-cols-4',
        className
      )}
    >
      {TaskList.map((task) => (
        <TaskGrid
          name={task.name}
          author={task.author}
          description={task.description}
          model={task.model}
          input={task.input}
          link={task.link}
        />
      ))}
    </div>
  );
}
