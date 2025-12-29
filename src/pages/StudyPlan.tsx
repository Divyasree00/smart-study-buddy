import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { studyPlannerApi, StudyPlanResponse } from '@/services/api';
import StudyCard from '@/components/StudyCard';
import { Loader2, BookOpen, Sparkles, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const StudyPlan = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [complexity, setComplexity] = useState([5]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StudyPlanResponse | null>(null);
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
    try {
      const response = await studyPlannerApi.createStudyPlan({
        subject,
        topic,
        complexity: complexity[0],
      });
      setResult(response);
      toast({
        title: 'Study Plan Created! 🎉',
        description: 'Your personalized study plan is ready.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create study plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSubject('');
    setTopic('');
    setComplexity([5]);
  };

  const handleDownload = () => {
    if (!result) return;

    const planText = `
STUDY PLAN
==========
Subject: ${subject}
Topic: ${topic}
Complexity: ${complexity[0]}/10

OVERVIEW
--------
Total Study Hours: ${result.study_hours}
Days Needed: ${result.days_needed}

SCHEDULE
--------
${result.study_schedule.map(s => `Day ${s.day}: ${s.hours} hours - ${s.focus}`).join('\n')}

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
    if (value <= 3) return { label: 'Beginner', color: 'text-green-500' };
    if (value <= 6) return { label: 'Intermediate', color: 'text-yellow-500' };
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
                        {complexityInfo.label} ({complexity[0]}/10)
                      </span>
                    </div>
                    <Slider
                      value={complexity}
                      onValueChange={setComplexity}
                      min={1}
                      max={10}
                      step={1}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Easy</span>
                      <span>Medium</span>
                      <span>Hard</span>
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
                  Subject: {subject} • Complexity: {complexityInfo.label}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="glass" onClick={handleReset} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  New Plan
                </Button>
                <Button variant="hero" onClick={handleDownload} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;
