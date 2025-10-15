import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Briefcase, Users, BookOpen, Bookmark, User, Settings } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Feed', path: '/feed' },
  { icon: Briefcase, label: 'Internships', path: '/internships' },
  { icon: Users, label: 'Recruitment', path: '/recruitment' },
  { icon: BookOpen, label: 'Study Materials', path: '/study-materials' },
  { icon: Bookmark, label: 'Saved Posts', path: '/saved' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-64 border-r border-border bg-card/50">
      <div className="sticky top-20 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-secondary/80',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
