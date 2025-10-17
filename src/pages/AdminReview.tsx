
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PostCard from '@/components/feed/PostCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';

const AdminReview = () => {
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), where('status', '==', 'pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Post);
      });
      setPendingPosts(posts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApproval = async (postId: string, newStatus: 'approved' | 'rejected') => {
    const postRef = doc(db, 'posts', postId);
    try {
      await updateDoc(postRef, { status: newStatus });
      toast({
        title: `Post ${newStatus}`,
        description: `The post has been successfully ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating post',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCreatePost={() => {}} onSearch={() => {}} unreadNotifications={0} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Admin Post Review</h1>
            <p className="text-muted-foreground">
              {pendingPosts.length} post(s) waiting for approval.
            </p>
          </div>

          <div className="space-y-6">
            {pendingPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending posts to review.</p>
              </div>
            ) : (
              pendingPosts.map((post) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} onLike={() => {}} onSave={() => {}} onShare={() => {}} isSaved={false} />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 hover:bg-green-200 text-green-800"
                      onClick={() => handleApproval(post.id, 'approved')}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-100 hover:bg-red-200 text-red-800"
                      onClick={() => handleApproval(post.id, 'rejected')}
                    >
                      <ShieldX className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReview;
