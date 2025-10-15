import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isSaved: boolean;
}

const PostCard = ({ post, onLike, onSave, onShare, onDelete, isSaved }: PostCardProps) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showFullContent, setShowFullContent] = useState(false);

  const isLiked = userData ? post.likes.includes(userData.id) : false;
  const canDelete = userData && (userData.id === post.userId || userData.isAdmin);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewPost = () => {
    navigate(`/post/${post.id}`);
  };

  const truncateContent = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(post.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{post.userName}</h3>
                {post.type === 'experience' && post.hasStipend && (
                  <Badge variant="default" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{post.userCollege}</span>
                <span>•</span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(post.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <h4 className="text-lg font-bold text-foreground mb-1">{post.title}</h4>
          {post.company && (
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <Briefcase className="h-4 w-4 mr-1" />
              <span className="font-medium">{post.company}</span>
              {post.location && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{post.location}</span>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-foreground">
          {showFullContent ? post.content : truncateContent(post.content, 200)}
          {post.content.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary hover:underline ml-1 font-medium"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {post.type === 'experience' && post.stipendAmount && (
          <div className="flex items-center space-x-2 text-sm">
            <Badge variant="secondary">
              <DollarSign className="h-3 w-3 mr-1" />
              {post.stipendAmount}
            </Badge>
            {post.duration && (
              <Badge variant="outline">{post.duration}</Badge>
            )}
          </div>
        )}

        {post.type === 'recruitment' && post.applicationLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(post.applicationLink, '_blank')}
            className="w-full"
          >
            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={isLiked ? 'text-destructive' : ''}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleViewPost}>
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{post.comments.length}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onShare(post.id)}>
            <Share2 className="h-4 w-4 mr-1" />
            <span>{post.shares}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave(post.id)}
          className={isSaved ? 'text-primary' : ''}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
