import routes from '@/config/routes';
import { TasksIcon } from '@/components/icons/task-icon';
import { ModelsIcon } from '@/components/icons/model-icon';
import { DocumentsIcon } from '@/components/icons/document-icon';


export const menuItems = [


  {
    name: 'Tasks',
    icon: <TasksIcon />,
    href: routes.search,
  },

  {
    name: 'Models',
    icon: <ModelsIcon />,
    href: routes.models,
  },


  {
    name: 'Documents',
    icon: <DocumentsIcon />,
    href: routes.documents,
  }
];
