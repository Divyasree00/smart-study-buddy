import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Clock, Target, Sparkles, BookOpen, Users, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Plans',
      description: 'Smart algorithms analyze your topic and create optimized study schedules.',
    },
    {
      icon: Clock,
      title: 'Time Optimization',
      description: 'Get accurate time estimates based on topic complexity and your learning pace.',
    },
    {
      icon: Target,
      title: 'Curated Resources',
      description: 'Access hand-picked YouTube tutorials and Google resources for each topic.',
    },
    {
      icon: Sparkles,
      title: 'AI Doubt Solver',
      description: 'Chat with our AI assistant to get instant answers to your study questions.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Study Plans Created' },
    { value: '95%', label: 'Student Satisfaction' },
    { value: '50+', label: 'Subjects Covered' },
    { value: '24/7', label: 'AI Support' },
  ];

  return (
    <div className="min-h-screen gradient-hero-bg">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              Smart AI-Powered
              <br />
              <span className="gradient-text">Study Planner</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Transform the way you learn with personalized study plans, curated resources, 
              and an AI assistant that's always ready to help clear your doubts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/study-plan">
                <Button variant="hero" size="xl" className="gap-2 group">
                  Create Study Plan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="xl" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8 max-w-2xl">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-soft ${
                        i === 2 ? 'animate-float' : 'animate-float-delayed'
                      }`}
                    >
                      <div className="w-full h-3 bg-primary/20 rounded-full mb-3" />
                      <div className="w-3/4 h-2 bg-muted rounded-full mb-2" />
                      <div className="w-1/2 h-2 bg-muted rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -left-6 top-1/4 bg-card rounded-xl p-3 shadow-lifted animate-float hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">AI Analysis</span>
              </div>
            </div>
            
            <div className="absolute -right-6 top-1/3 bg-card rounded-xl p-3 shadow-lifted animate-float-delayed hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-accent-bg flex items-center justify-center">
                  <Target className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">Personalized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">StudyAI</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with proven learning methodologies 
              to help you study smarter, not harder.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-card p-6 rounded-2xl border border-border/50 shadow-soft hover:shadow-lifted hover:border-primary/30 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your personalized study plan in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: 1, title: 'Enter Topic', desc: 'Tell us what you want to learn and how complex it is' },
                { step: 2, title: 'AI Analysis', desc: 'Our AI analyzes the topic and creates an optimal plan' },
                { step: 3, title: 'Start Learning', desc: 'Follow your personalized schedule with curated resources' },
              ].map((item, index) => (
                <div key={index} className="relative text-center animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <span className="text-2xl font-display font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/study-plan">
              <Button variant="hero" size="xl" className="gap-2 group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">
                Study<span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StudyAI. Built with ❤️ for students everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
