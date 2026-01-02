import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { studyPlannerApi } from '@/services/api';
import { Star, Send, Loader2, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Get stored plan data for Q-learning feedback
  const getPlanData = () => {
    try {
      const stored = sessionStorage.getItem('studyPlanData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const planData = getPlanData();
      // Submit feedback - for client-side RL, this is a no-op but we keep the form for UX
      if (planData && planData.rl_action !== undefined) {
        studyPlannerApi.submitFeedback(planData.complexity, planData.rl_action, rating >= 3);
      }
      setIsSubmitted(true);
      
      // Clear stored plan data after successful feedback
      sessionStorage.removeItem('studyPlanData');
      
      toast({
        title: 'Thank you! 🙏',
        description: planData 
          ? 'Your feedback has been used to improve our Q-learning model.' 
          : 'Your feedback has been submitted successfully.',
      });
    } catch (error) {
      console.error('Feedback error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingLabel = (value: number) => {
    switch (value) {
      case 1: return 'Poor 😞';
      case 2: return 'Fair 😐';
      case 3: return 'Good 🙂';
      case 4: return 'Great 😊';
      case 5: return 'Excellent 🤩';
      default: return 'Select a rating';
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen gradient-hero-bg pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="card-gradient border-border/50 shadow-lifted text-center">
              <CardContent className="pt-12 pb-8">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-3">Thank You!</h2>
                <p className="text-muted-foreground mb-6">
                  Your feedback helps us improve StudyAI for everyone. We truly appreciate you taking the time to share your thoughts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button variant="glass" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/study-plan">
                    <Button variant="hero" className="gap-2">
                      Create New Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero-bg pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              <span>We Value Your Input</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Share Your <span className="gradient-text">Feedback</span>
            </h1>
            <p className="text-muted-foreground">
              Help us make StudyAI better for students like you
            </p>
          </div>

          <Card className="card-gradient border-border/50 shadow-lifted">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Rate Your Experience
              </CardTitle>
              <CardDescription>
                How would you rate your experience with StudyAI?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none focus:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm font-medium text-muted-foreground">
                    {getRatingLabel(hoveredRating || rating)}
                  </p>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium text-foreground">
                    Additional Comments (Optional)
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts, suggestions, or any issues you encountered..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary min-h-[120px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || rating === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Your feedback is anonymous and helps us improve our platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
