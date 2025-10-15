import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Post, SavedPost } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import PostCard from '@/components/feed/PostCard';
import CreatePostDialog from '@/components/feed/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, SlidersHorizontal } from 'lucide-react';

const Feed = () => {
  const { userData } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStipend, setFilterStipend] = useState<string>('all');

  // Fetch posts
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPosts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Post);
      });
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch saved posts
  useEffect(() => {
    if (!userData) return;

    const q = query(collection(db, 'savedPosts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const saved: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userData.id) {
          saved.push(data.postId);
        }
      });
      setSavedPosts(saved);
    });

    return () => unsubscribe();
  }, [userData]);

  const handleLike = async (postId: string) => {
    if (!userData) return;

    const postRef = doc(db, 'posts', postId);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likes.includes(userData.id);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userData.id),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userData.id),
        });
        
        // Create notification
        if (post.userId !== userData.id) {
          await addDoc(collection(db, 'notifications'), {
            userId: post.userId,
            type: 'like',
            postId: postId,
            postTitle: post.title,
            fromUserId: userData.id,
            fromUserName: userData.name,
            message: `${userData.name} liked your post`,
            read: false,
            createdAt: Timestamp.now(),
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (postId: string) => {
    if (!userData) return;

    const isSaved = savedPosts.includes(postId);

    try {
      if (isSaved) {
        // Find and delete the saved post document
        const q = query(collection(db, 'savedPosts'));
        const snapshot = await new Promise<any>((resolve) => {
          const unsubscribe = onSnapshot(q, (snapshot) => {
            unsubscribe();
            resolve(snapshot);
          });
        });

        snapshot.forEach(async (docSnap: any) => {
          const data = docSnap.data();
          if (data.userId === userData.id && data.postId === postId) {
            await deleteDoc(doc(db, 'savedPosts', docSnap.id));
          }
        });
        
        toast({
          title: "Post unsaved",
        });
      } else {
        await addDoc(collection(db, 'savedPosts'), {
          userId: userData.id,
          postId: postId,
          savedAt: Timestamp.now(),
        });
        
        toast({
          title: "Post saved!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard",
    });

    // Increment share count
    const postRef = doc(db, 'posts', postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      updateDoc(postRef, {
        shares: (post.shares || 0) + 1,
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!userData) return;

    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      toast({
        title: "Post deleted",
        description: "Your post has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.company?.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filterType !== 'all' && post.type !== filterType) {
      return false;
    }

    // Stipend filter
    if (filterStipend !== 'all') {
      if (filterStipend === 'paid' && !post.hasStipend) return false;
      if (filterStipend === 'unpaid' && post.hasStipend) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onCreatePost={() => setCreatePostOpen(true)}
        onSearch={setSearchQuery}
        unreadNotifications={0}
      />

      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full pb-20 lg:pb-6">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Post Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="experience">Experiences</SelectItem>
                <SelectItem value="recruitment">Recruitment</SelectItem>
                <SelectItem value="study">Study Materials</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStipend} onValueChange={setFilterStipend}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stipend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="unpaid">Unpaid Only</SelectItem>
              </SelectContent>
            </Select>

            {(filterType !== 'all' || filterStipend !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setFilterStipend('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found. Be the first to share!</p>
                <Button onClick={() => setCreatePostOpen(true)} className="mt-4">
                  Create Post
                </Button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShare={handleShare}
                  onDelete={handleDelete}
                  isSaved={savedPosts.includes(post.id)}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <MobileNav onCreatePost={() => setCreatePostOpen(true)} />

      <CreatePostDialog
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onSuccess={() => {
          toast({
            title: "Success!",
            description: "Your post has been published",
          });
        }}
      />
    </div>
  );
};

export default Feed;
