import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ProgressNudge } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { X, Bell, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NudgeBannerProps {
  userId: string;
}

export function NudgeBanner({ userId }: NudgeBannerProps) {
  const queryClient = useQueryClient();

  const { data: nudges = [] } = useQuery<ProgressNudge[]>({
    queryKey: ["nudges", userId],
    queryFn: () => api.getNudges(),
    enabled: !!userId,
    refetchInterval: 60000,
  });

  const dismissMutation = useMutation({
    mutationFn: (nudgeId: string) => api.dismissNudge(nudgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nudges", userId] });
    },
  });

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case "stalled":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "encouragement":
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case "reminder":
        return <Bell className="h-5 w-5 text-blue-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-orange-400" />;
    }
  };

  const getNudgeStyle = (type: string) => {
    switch (type) {
      case "stalled":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "encouragement":
        return "bg-green-500/10 border-green-500/30";
      case "reminder":
        return "bg-blue-500/10 border-blue-500/30";
      default:
        return "bg-orange-500/10 border-orange-500/30";
    }
  };

  if (nudges.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      <AnimatePresence>
        {nudges.map((nudge) => (
          <motion.div
            key={nudge.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex items-center gap-4 p-4 rounded-lg border ${getNudgeStyle(nudge.nudgeType)}`}
          >
            {getNudgeIcon(nudge.nudgeType)}
            <p className="flex-1 text-sm" data-testid={`text-nudge-${nudge.id}`}>{nudge.message}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dismissMutation.mutate(nudge.id)}
              data-testid={`button-dismiss-nudge-${nudge.id}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
