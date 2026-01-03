import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { studyPlannerApi, StudyPlanResponse } from '@/services/api';
import StudyCard from '@/components/StudyCard';
import { Loader2, BookOpen, Sparkles, Download, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const StudyPlan = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState([2]); // 1=Beginner, 2=Intermediate, 3=Advanced
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StudyPlanResponse | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [currentAction, setCurrentAction] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !topic.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both subject and topic fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setIsApproved(false);
    
    try {
      const response = await studyPlannerApi.createStudyPlan({
        subject,
        topic,
        complexity: complexity[0],
      });
      
      setResult(response);
      setCurrentAction(response.rl_action);
      
      toast({
        title: 'Study Plan Created! 🎉',
        description: `${response.study_hours} hours over ${response.days_needed} days`,
      });
    } catch (error) {
      console.error('Study plan error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create study plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    if (!result || currentAction === null) return;
    
    // Submit negative feedback for rejection
    studyPlannerApi.submitFeedback(complexity[0], currentAction, false);
    
    setIsLoading(true);
    setIsApproved(false);
    
    try {
      const response = await studyPlannerApi.createStudyPlan({
        subject,
        topic,
        complexity: complexity[0],
      });
      
      setResult(response);
      setCurrentAction(response.rl_action);
      
      toast({
        title: 'New Plan Generated! 🔄',
        description: ' model updatesbased on your feedback.',
      });
    } catch (error) {
      console.error('Study plan error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate new plan.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (!result || currentAction === null) return;
    
    // Submit positive feedback for approval
    studyPlannerApi.submitFeedback(complexity[0], currentAction, true);
    setIsApproved(true);
    
    toast({
      title: 'Plan Approved! ✅',
      description: 'You can now download your study plan.',
    });
  };

  const handleReset = () => {
    setResult(null);
    setSubject('');
    setTopic('');
    setComplexity([2]);
    setIsApproved(false);
    setCurrentAction(null);
  };

  const handleDownload = () => {
    if (!result || !isApproved) return;

    const planText = `
STUDY PLAN
==========
Subject: ${subject}
Topic: ${topic}
Complexity: ${result.complexity_level}
Intensity: ${result.difficulty_info?.intensity || 'Balanced'}

OVERVIEW
--------
Total Study Hours: ${result.study_hours}
Days Needed: ${result.days_needed}
${result.difficulty_info ? `
RECOMMENDED APPROACH
--------------------
Resource Types: ${result.difficulty_info.resourceTypes.join(', ')}
Session Duration: ${result.difficulty_info.estimatedTime}
Learning Outcome: ${result.difficulty_info.learningOutcome}
` : ''}
SCHEDULE
--------
${result.study_schedule.map(s => `Day ${s.day}: ${s.hours} hours - ${s.focus}${s.activities ? '\n  Activities: ' + s.activities.join(', ') : ''}`).join('\n')}

YOUTUBE RESOURCES
-----------------
${result.youtube_resources.map(r => `- ${r.title}: ${r.url}`).join('\n')}

GOOGLE RESOURCES
----------------
${result.google_resources.map(r => `- ${r.title}: ${r.url}`).join('\n')}
    `.trim();

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-plan-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded! 📥',
      description: 'Your study plan has been saved.',
    });
  };

  const getComplexityLabel = (value: number) => {
    if (value === 1) return { label: 'Beginner', color: 'text-green-500' };
    if (value === 2) return { label: 'Intermediate', color: 'text-yellow-500' };
    return { label: 'Advanced', color: 'text-red-500' };
  };

  const complexityInfo = getComplexityLabel(complexity[0]);

  return (
    <div className="min-h-screen gradient-hero-bg pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {!result ? (
          /* Form Section */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Planning</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Create Your <span className="gradient-text">Study Plan</span>
              </h1>
              <p className="text-muted-foreground">
                Tell us what you want to learn, and we'll create a personalized study schedule
              </p>
            </div>

            <Card className="card-gradient border-border/50 shadow-lifted">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Study Details
                </CardTitle>
                <CardDescription>
                  Fill in the details below to generate your personalized plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Computer Science, Mathematics, Physics"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-foreground">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Python Lists, Calculus, Quantum Mechanics"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Complexity Level</Label>
                      <span className={`text-sm font-medium ${complexityInfo.color}`}>
                        {complexityInfo.label}
                      </span>
                    </div>
                    <Slider
                      value={complexity}
                      onValueChange={setComplexity}
                      min={1}
                      max={3}
                      step={1}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Study Plan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Section */
          <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">
                  Your Study Plan for <span className="gradient-text">{topic}</span>
                </h1>
                <p className="text-muted-foreground">
                  Subject: {subject} • Complexity: {complexityInfo.label} • Intensity: {result.difficulty_info?.intensity || 'Balanced'}
                </p>
              </div>
              <Button variant="glass" onClick={handleReset} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <StudyCard
                type="overview"
                data={{
                  studyHours: result.study_hours,
                  daysNeeded: result.days_needed,
                }}
              />
              <StudyCard
                type="schedule"
                data={{ schedule: result.study_schedule }}
              />
              <StudyCard
                type="youtube"
                data={{ resources: result.youtube_resources }}
              />
              <StudyCard
                type="google"
                data={{ resources: result.google_resources }}
              />
            </div>

            {/* Approval Section */}
            <div className="mt-8 p-6 bg-secondary/30 rounded-xl border border-border/50">
              <p className="text-center text-foreground font-medium mb-4">
                Are you satisfied with this study plan?
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleGenerateNew} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Generate New Plan
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant={isApproved ? "default" : "secondary"}
                    onClick={handleApprove}
                    disabled={isApproved}
                    className="gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isApproved ? 'Approved' : 'Approve Plan'}
                  </Button>
                  
                  <Button
                    variant="hero"
                    size="icon"
                    onClick={handleDownload}
                    disabled={!isApproved}
                    className={`transition-opacity ${!isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isApproved ? 'Download plan' : 'Approve plan first to download'}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-center text-xs text-muted-foreground mt-4">
                You can regenerate plans as many times as you want before approving. Approve the plan to unlock download.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;
