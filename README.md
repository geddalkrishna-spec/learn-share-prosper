# Campus Connect

A modern platform for college students to share internship experiences, find recruitment opportunities, and access study materials.

## 🚀 Features

- **Authentication**: Email/password authentication with Firebase
- **Internship Experiences**: Share detailed internship experiences with stipend info, tips, and more
- **Recruitment Posts**: HR and seniors can post job opportunities
- **Study Materials**: Access company-wise interview questions and study guides
- **Interactions**: Like, comment, share, and save posts
- **Search & Filters**: Search by company, filter by post type, stipend status
- **Notifications**: Get notified when someone likes or comments on your posts
- **Admin Moderation**: Admin users can delete any post
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- A Firebase account (free tier works perfectly)

## 🔧 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "campus-connect")
4. Disable Google Analytics (optional) or configure it
5. Click "Create project"

### Step 2: Register Your Web App

1. In your Firebase project dashboard, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "Campus Connect Web")
3. Copy the Firebase configuration object - you'll need this!

### Step 3: Enable Authentication

1. In the Firebase console, go to **Authentication** from the left sidebar
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 4: Enable Firestore Database

1. In the Firebase console, go to **Firestore Database** from the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a Cloud Firestore location (choose closest to you)
5. Click "Enable"

### Step 5: Configure Firestore Security Rules

For development, you can use these rules (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all documents
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Users collection - users can update their own document
    match /users/{userId} {
      allow create: if request.auth != null;
      allow update: if request.auth.uid == userId;
    }
    
    // Posts collection - authenticated users can create
    match /posts/{postId} {
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Saved posts - users can manage their own saved posts
    match /savedPosts/{savedPostId} {
      allow create, delete: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Notifications - users can read their own notifications
    match /notifications/{notificationId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

For **production**, use stricter rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(userId);
      allow delete: if false; // Never allow user deletion via client
    }
    
    match /posts/{postId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && 
        request.resource.data.userId == request.auth.uid;
      allow update: if isSignedIn() && 
        (isOwner(resource.data.userId) || isAdmin());
      allow delete: if isSignedIn() && 
        (isOwner(resource.data.userId) || isAdmin());
    }
    
    match /savedPosts/{savedPostId} {
      allow read: if isSignedIn() && 
        request.auth.uid == resource.data.userId;
      allow create: if isSignedIn() && 
        request.resource.data.userId == request.auth.uid;
      allow delete: if isSignedIn() && 
        isOwner(resource.data.userId);
    }
    
    match /notifications/{notificationId} {
      allow read, update: if isSignedIn() && 
        isOwner(resource.data.userId);
      allow create: if isSignedIn();
      allow delete: if false;
    }
  }
}
```

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd campus-connect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Open `src/lib/firebase.ts` and replace the placeholder config with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

You can find this in:
- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 👤 Demo Account

You can create a demo account using:
- **Email**: test@demo.com
- **Password**: test123

Or register a new account from the sign-up page.

## 📱 Using the App

1. **Sign Up / Log In**: Create an account or use the demo credentials
2. **Create Posts**: Click the "Create Post" button to share experiences, job posts, or study materials
3. **Interact**: Like, comment, share, and save posts
4. **Search**: Use the search bar to find posts by company, keyword, or tags
5. **Filter**: Filter posts by type (experience/recruitment/study) and stipend status
6. **Profile**: View and edit your profile, see all your posts

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/          # Login and Register pages
│   ├── feed/          # Post card and create post dialog
│   ├── layout/        # Navbar, Sidebar, Mobile Nav
│   └── ui/            # shadcn/ui components
├── contexts/          # Auth context for user management
├── lib/               # Firebase config and utilities
├── pages/             # Main pages (Feed, Profile, etc.)
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component with routing
```

## 🔐 Security Best Practices

- Never commit your Firebase config with real API keys to public repos
- Use environment variables for sensitive data in production
- Always implement proper Firestore security rules
- Validate all user inputs on both client and server side
- Implement rate limiting for API calls
- Enable App Check for additional security (production)

## 🚀 Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 📦 Deployment

### Deploy to Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Other Options

- **Vercel**: Connect your Git repo and deploy automatically
- **Netlify**: Drag and drop the `dist/` folder or connect Git repo
- **AWS S3 + CloudFront**: Upload build files to S3 bucket

## 🔄 Migrating to a Real Backend

While Firebase Firestore provides a robust backend, if you want to migrate to a custom backend:

1. **Database**: Replace Firestore with PostgreSQL/MongoDB
2. **Authentication**: Use JWT tokens with your backend
3. **API**: Create REST or GraphQL endpoints
4. **State**: Replace Firebase real-time listeners with API polling or WebSockets

Example API endpoints you'd need:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Fetch posts (with filters)
- `POST /api/posts` - Create post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comments` - Add comment
- etc.

## 📝 License

MIT License - feel free to use this project for learning or building your own platform!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues:
1. Check the Firebase console for authentication/database errors
2. Open the browser console to see detailed error messages
3. Ensure your Firebase security rules are correctly configured

## 🎉 Credits

Built with ❤️ using:
- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
