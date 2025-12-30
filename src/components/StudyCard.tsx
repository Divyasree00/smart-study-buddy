import { ExternalLink, Clock, Calendar, Youtube, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudyCardProps {
  type: 'overview' | 'youtube' | 'google' | 'schedule';
  data: {
    studyHours?: number;
    daysNeeded?: number;
    resources?: Array<{ title: string; url: string; thumbnail?: string; snippet?: string }>;
    schedule?: Array<{ day: number; hours: number; focus: string; activities?: string[] }>;
  };
}

const StudyCard = ({ type, data }: StudyCardProps) => {
  if (type === 'overview') {
    return (
      <Card className="card-gradient border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5" />
        <CardHeader className="relative">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            Study Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-display font-bold gradient-text">{data.studyHours}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Hours</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-display font-bold gradient-text">{data.daysNeeded}</p>
              <p className="text-sm text-muted-foreground mt-1">Days Needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'youtube') {
    return (
      <Card className="card-gradient border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            YouTube Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.resources?.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'google') {
    return (
      <Card className="card-gradient border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            Google Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.resources?.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'schedule') {
    return (
      <Card className="card-gradient border-border/50 shadow-soft hover:shadow-lifted transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-accent-bg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            Study Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.schedule?.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">D{item.day}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.focus}</p>
                    <p className="text-sm text-muted-foreground">{item.hours} hours of focused study</p>
                  </div>
                </div>
                {item.activities && item.activities.length > 0 && (
                  <div className="mt-2 ml-16 flex flex-wrap gap-1">
                    {item.activities.map((activity, actIdx) => (
                      <span key={actIdx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {activity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default StudyCard;
