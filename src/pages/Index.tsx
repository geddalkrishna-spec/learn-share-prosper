import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, BookOpen, Users, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Campus Connect
            </span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Connect, Share, Succeed
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The ultimate platform for college students to share internship experiences,
            find recruitment opportunities, and access study materials—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')} className="text-lg">
              Join Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Internship Experiences</h3>
            <p className="text-muted-foreground">
              Share detailed internship experiences including stipends, company culture,
              and tips to crack the interview. Help others make informed decisions.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all">
            <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Job Recruitment</h3>
            <p className="text-muted-foreground">
              Discover latest internship and job opportunities posted by HRs and seniors.
              Apply directly with one click and never miss an opportunity.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all">
            <div className="p-3 bg-success/10 rounded-lg w-fit mb-4">
              <BookOpen className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Study Materials</h3>
            <p className="text-muted-foreground">
              Access company-wise interview questions, preparation guides, and study materials
              curated by students who've been there.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already using Campus Connect
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="text-lg">
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
