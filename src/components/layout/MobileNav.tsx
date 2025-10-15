import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Briefcase, BookOpen, Bookmark, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  onCreatePost: () => void;
}

const MobileNav = ({ onCreatePost }: MobileNavProps) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Feed', path: '/feed' },
    { icon: Briefcase, label: 'Jobs', path: '/recruitment' },
    { icon: BookOpen, label: 'Study', path: '/study-materials' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
        
        <Button
          onClick={onCreatePost}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};

export default MobileNav;
