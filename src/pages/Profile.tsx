import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/types';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import PostCard from '@/components/feed/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, GraduationCap, Mail, Phone, Linkedin, Briefcase } from 'lucide-react';

const Profile = () => {
  const { userData, updateUserData } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: userData?.name || '',
    bio: userData?.bio || '',
    phone: userData?.phone || '',
    linkedIn: userData?.linkedIn || '',
  });

  useEffect(() => {
    if (!userData) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userData.id)
    );

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
      setUserPosts(posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    });

    return () => unsubscribe();
  }, [userData]);

  const handleSaveProfile = async () => {
    await updateUserData(editData);
    setEditDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onCreatePost={() => {}}
        onSearch={() => {}}
        unreadNotifications={0}
      />

      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full pb-20 lg:pb-6">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl mb-1">{userData.name}</CardTitle>
                    <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {userData.college} • {userData.year}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {userData.email}
                      </div>
                      {userData.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {userData.phone}
                        </div>
                      )}
                      {userData.linkedIn && (
                        <div className="flex items-center">
                          <Linkedin className="h-4 w-4 mr-2" />
                          <a 
                            href={userData.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={3}
                          placeholder="Tell us about yourself..."
                          value={editData.bio}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/in/username"
                          value={editData.linkedIn}
                          onChange={(e) => setEditData({...editData, linkedIn: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleSaveProfile} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            {userData.bio && (
              <CardContent>
                <p className="text-foreground">{userData.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{userPosts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {userPosts.reduce((acc, post) => acc + post.likes.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {userPosts.reduce((acc, post) => acc + post.comments.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="experience">Experiences</TabsTrigger>
              <TabsTrigger value="recruitment">Jobs</TabsTrigger>
              <TabsTrigger value="study">Study</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No posts yet</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => {}}
                    onSave={() => {}}
                    onShare={() => {}}
                    isSaved={false}
                    showStatus={true}
                  />
                ))
              )}
            </TabsContent>

            {['experience', 'recruitment', 'study'].map(type => (
              <TabsContent key={type} value={type} className="space-y-6 mt-6">
                {userPosts.filter(p => p.type === type).length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No {type} posts yet</p>
                  </div>
                ) : (
                  userPosts
                    .filter(p => p.type === type)
                    .map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={() => {}}
                        onSave={() => {}}
                        onShare={() => {}}
                        isSaved={false}
                      />
                    ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      <MobileNav onCreatePost={() => {}} />
    </div>
  );
};

export default Profile;
