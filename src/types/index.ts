// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  year: string;
  phone?: string;
  bio?: string;
  linkedIn?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Post {
  id: string;
  type: 'experience' | 'recruitment' | 'study';
  userId: string;
  userName: string;
  userCollege: string;
  userYear: string;
  userLinkedIn?: string;
  
  // Common fields
  title: string;
  content: string;
  company?: string;
  tags: string[];
  attachments: string[];
  
  // Experience post specific
  jobTitle?: string;
  hasStipend?: boolean;
  stipendAmount?: string;
  wasWorthIt?: boolean;
  worthReason?: string;
  howToCrack?: string;
  hrPhone?: string;
  location?: string;
  duration?: string;
  whatYouGained?: string;
  companyFocus?: string;
  expectations?: string;
  projectDone?: string;
  
  // Recruitment post specific
  applicationLink?: string;
  requirements?: string;
  
  // Study material specific
  subject?: string;
  
  // Interactions
  likes: string[]; // Array of user IDs
  comments: Comment[];
  shares: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userCollege: string;
  content: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'share';
  postId: string;
  postTitle: string;
  fromUserId: string;
  fromUserName: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SavedPost {
  userId: string;
  postId: string;
  savedAt: Date;
}

export interface FilterOptions {
  postType?: 'all' | 'experience' | 'recruitment' | 'study';
  hasStipend?: boolean;
  location?: string;
  company?: string;
  searchQuery?: string;
}
