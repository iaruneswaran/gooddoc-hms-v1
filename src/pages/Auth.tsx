import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import the logo
import logoSvg from '@/assets/baines-logo-full.svg';

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleForgotPassword = () => {
    toast.info('Password Reset', {
      description: 'Please contact your administrator to reset your password.',
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logoSvg} 
              alt="GoodDoc Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {activeTab === 'login' ? 'Welcome back to GoodDoc' : 'Create your GoodDoc account'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === 'login'
                ? 'Sign in to continue'
                : 'Get started with your hospital management'}
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm onForgotPassword={handleForgotPassword} />
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <SignupForm />
            </TabsContent>
          </Tabs>

          {/* Demo credentials hint */}
          {import.meta.env.VITE_AUTH_DEMO !== 'false' && (
            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-medium">Demo credentials:</span>{' '}
                <code className="px-1.5 py-0.5 bg-muted rounded text-foreground">gooddoc</code> /{' '}
                <code className="px-1.5 py-0.5 bg-muted rounded text-foreground">123456</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/auth-side.jpg"
          alt="GoodDoc preview"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a gradient background if image is missing
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = 
                'linear-gradient(135deg, hsl(218 80% 50%) 0%, hsl(174 100% 36%) 100%)';
            }
          }}
        />
        {/* Overlay gradients for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Hospital Management Simplified
          </h2>
          <p className="text-white/80 text-sm">
            Streamline your hospital operations with GoodDoc's comprehensive management platform.
          </p>
        </div>
      </div>
    </div>
  );
}
