import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePostDialog = ({ open, onClose, onSuccess }: CreatePostDialogProps) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState<'experience' | 'recruitment' | 'study'>('experience');

  // Experience form state
  const [experienceData, setExperienceData] = useState({
    title: '',
    company: '',
    jobTitle: '',
    content: '',
    hasStipend: false,
    stipendAmount: '',
    wasWorthIt: true,
    worthReason: '',
    howToCrack: '',
    hrPhone: '',
    location: '',
    duration: '',
    whatYouGained: '',
    companyFocus: '',
    expectations: '',
    projectDone: '',
    tags: '',
    attachments: '',
  });

  // Recruitment form state
  const [recruitmentData, setRecruitmentData] = useState({
    title: '',
    company: '',
    jobTitle: '',
    content: '',
    requirements: '',
    applicationLink: '',
    location: '',
    duration: '',
    hasStipend: false,
    stipendAmount: '',
    tags: '',
  });

  // Study material form state
  const [studyData, setStudyData] = useState({
    title: '',
    company: '',
    subject: '',
    content: '',
    tags: '',
    attachments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);
    try {
      const basePost = {
        type: postType,
        userId: userData.id,
        userName: userData.name,
        userCollege: userData.college,
        userYear: userData.year,
        userLinkedIn: userData.linkedIn || '',
        likes: [],
        comments: [],
        shares: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      let postData: any = { ...basePost };

      if (postType === 'experience') {
        postData = {
          ...postData,
          ...experienceData,
          tags: experienceData.tags.split(',').map(t => t.trim()).filter(t => t),
          attachments: experienceData.attachments.split(',').map(a => a.trim()).filter(a => a),
        };
      } else if (postType === 'recruitment') {
        postData = {
          ...postData,
          ...recruitmentData,
          tags: recruitmentData.tags.split(',').map(t => t.trim()).filter(t => t),
        };
      } else {
        postData = {
          ...postData,
          ...studyData,
          tags: studyData.tags.split(',').map(t => t.trim()).filter(t => t),
          attachments: studyData.attachments.split(',').map(a => a.trim()).filter(a => a),
        };
      }

      await addDoc(collection(db, 'posts'), postData);

      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });

      onSuccess();
      onClose();
      
      // Reset forms
      setExperienceData({
        title: '', company: '', jobTitle: '', content: '', hasStipend: false,
        stipendAmount: '', wasWorthIt: true, worthReason: '', howToCrack: '',
        hrPhone: '', location: '', duration: '', whatYouGained: '',
        companyFocus: '', expectations: '', projectDone: '', tags: '', attachments: '',
      });
      setRecruitmentData({
        title: '', company: '', jobTitle: '', content: '', requirements: '',
        applicationLink: '', location: '', duration: '', hasStipend: false,
        stipendAmount: '', tags: '',
      });
      setStudyData({
        title: '', company: '', subject: '', content: '', tags: '', attachments: '',
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your experience, post recruitment opportunities, or add study materials
          </DialogDescription>
        </DialogHeader>

        <Tabs value={postType} onValueChange={(v) => setPostType(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="study">Study Material</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-title">Title *</Label>
                  <Input
                    id="exp-title"
                    placeholder="Software Engineering Intern at Google"
                    value={experienceData.title}
                    onChange={(e) => setExperienceData({...experienceData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-company">Company *</Label>
                  <Input
                    id="exp-company"
                    placeholder="Google"
                    value={experienceData.company}
                    onChange={(e) => setExperienceData({...experienceData, company: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exp-content">Experience Description *</Label>
                <Textarea
                  id="exp-content"
                  placeholder="Share your internship experience..."
                  rows={4}
                  value={experienceData.content}
                  onChange={(e) => setExperienceData({...experienceData, content: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-job-title">Job Title</Label>
                  <Input
                    id="exp-job-title"
                    placeholder="Software Engineering Intern"
                    value={experienceData.jobTitle}
                    onChange={(e) => setExperienceData({...experienceData, jobTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-location">Location</Label>
                  <Input
                    id="exp-location"
                    placeholder="Bangalore"
                    value={experienceData.location}
                    onChange={(e) => setExperienceData({...experienceData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="has-stipend"
                  checked={experienceData.hasStipend}
                  onCheckedChange={(checked) => setExperienceData({...experienceData, hasStipend: checked})}
                />
                <Label htmlFor="has-stipend">Paid Internship</Label>
              </div>

              {experienceData.hasStipend && (
                <div className="space-y-2">
                  <Label htmlFor="stipend-amount">Stipend Amount</Label>
                  <Input
                    id="stipend-amount"
                    placeholder="₹50,000/month"
                    value={experienceData.stipendAmount}
                    onChange={(e) => setExperienceData({...experienceData, stipendAmount: e.target.value})}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="3 months"
                    value={experienceData.duration}
                    onChange={(e) => setExperienceData({...experienceData, duration: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-phone">HR Phone (Optional)</Label>
                  <Input
                    id="hr-phone"
                    placeholder="+91 98765 43210"
                    value={experienceData.hrPhone}
                    onChange={(e) => setExperienceData({...experienceData, hrPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="how-to-crack">How to Crack</Label>
                <Textarea
                  id="how-to-crack"
                  placeholder="Tips and preparation strategy..."
                  rows={2}
                  value={experienceData.howToCrack}
                  onChange={(e) => setExperienceData({...experienceData, howToCrack: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="software, google, android, paid-internship"
                  value={experienceData.tags}
                  onChange={(e) => setExperienceData({...experienceData, tags: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publish Experience
              </Button>
            </TabsContent>

            {/* Recruitment Tab */}
            <TabsContent value="recruitment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rec-title">Title *</Label>
                  <Input
                    id="rec-title"
                    placeholder="Summer Internship 2024"
                    value={recruitmentData.title}
                    onChange={(e) => setRecruitmentData({...recruitmentData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rec-company">Company *</Label>
                  <Input
                    id="rec-company"
                    placeholder="Zomato"
                    value={recruitmentData.company}
                    onChange={(e) => setRecruitmentData({...recruitmentData, company: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rec-content">Description *</Label>
                <Textarea
                  id="rec-content"
                  placeholder="Job description..."
                  rows={4}
                  value={recruitmentData.content}
                  onChange={(e) => setRecruitmentData({...recruitmentData, content: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rec-job-title">Job Title</Label>
                  <Input
                    id="rec-job-title"
                    placeholder="Software Development Intern"
                    value={recruitmentData.jobTitle}
                    onChange={(e) => setRecruitmentData({...recruitmentData, jobTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rec-location">Location</Label>
                  <Input
                    id="rec-location"
                    placeholder="Bangalore"
                    value={recruitmentData.location}
                    onChange={(e) => setRecruitmentData({...recruitmentData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Required skills and qualifications..."
                  rows={3}
                  value={recruitmentData.requirements}
                  onChange={(e) => setRecruitmentData({...recruitmentData, requirements: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="application-link">Application Link *</Label>
                <Input
                  id="application-link"
                  placeholder="https://company.com/careers/apply"
                  value={recruitmentData.applicationLink}
                  onChange={(e) => setRecruitmentData({...recruitmentData, applicationLink: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rec-tags">Tags (comma-separated)</Label>
                <Input
                  id="rec-tags"
                  placeholder="recruitment, software, backend"
                  value={recruitmentData.tags}
                  onChange={(e) => setRecruitmentData({...recruitmentData, tags: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Job Opening
              </Button>
            </TabsContent>

            {/* Study Material Tab */}
            <TabsContent value="study" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="study-title">Title *</Label>
                  <Input
                    id="study-title"
                    placeholder="Google Interview Prep Guide"
                    value={studyData.title}
                    onChange={(e) => setStudyData({...studyData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="study-company">Company</Label>
                  <Input
                    id="study-company"
                    placeholder="Google"
                    value={studyData.company}
                    onChange={(e) => setStudyData({...studyData, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Interview Preparation"
                  value={studyData.subject}
                  onChange={(e) => setStudyData({...studyData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-content">Description *</Label>
                <Textarea
                  id="study-content"
                  placeholder="What does this material cover?"
                  rows={4}
                  value={studyData.content}
                  onChange={(e) => setStudyData({...studyData, content: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-attachments">Links (comma-separated)</Label>
                <Input
                  id="study-attachments"
                  placeholder="https://drive.google.com/file/..., https://..."
                  value={studyData.attachments}
                  onChange={(e) => setStudyData({...studyData, attachments: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-tags">Tags (comma-separated)</Label>
                <Input
                  id="study-tags"
                  placeholder="google, interview-prep, dsa"
                  value={studyData.tags}
                  onChange={(e) => setStudyData({...studyData, tags: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Share Study Material
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
