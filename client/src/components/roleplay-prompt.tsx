import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, SkipForward, Target, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { PredefinedRoleplay } from "@/lib/chapter1-roleplays";
import { useOrientation, useIsMobile } from "@/hooks/useOrientation";

interface RoleplayPromptProps {
  roleplay: PredefinedRoleplay;
  onStart: () => void;
  onSkip: () => void;
  queuePosition?: number;
  queueTotal?: number;
  attemptsUsed?: number;
  maxAttempts?: number;
  hasPassed?: boolean;
  permanentlyFailed?: boolean;
}

export function RoleplayPrompt({ 
  roleplay, 
  onStart, 
  onSkip,
  queuePosition = 1,
  queueTotal = 1,
  attemptsUsed = 0,
  maxAttempts = 3,
  hasPassed = false,
  permanentlyFailed = false
}: RoleplayPromptProps) {
  const attemptsRemaining = maxAttempts - attemptsUsed;
  const orientation = useOrientation();
  const isMobile = useIsMobile();
  const isLandscape = orientation === 'landscape';
  const isImmersive = isMobile && isLandscape;

  if (permanentlyFailed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-red-950 to-gray-900 rounded-2xl border border-red-800/50 shadow-2xl w-full max-w-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Roleplay Locked</h3>
                <p className="text-sm text-red-400">No attempts remaining</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              You've used all 3 attempts for this roleplay without passing. Focus on other roleplays to continue your certification path.
            </p>
            <Button onClick={onSkip} className="w-full bg-gray-700 hover:bg-gray-600 text-white">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (hasPassed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-green-950 to-gray-900 rounded-2xl border border-green-700/50 shadow-2xl w-full max-w-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Already Passed!</h3>
                <p className="text-sm text-green-400">Great work on this roleplay</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              You've already passed this roleplay. Keep up the momentum and continue to the next challenge!
            </p>
            <Button onClick={onSkip} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        style={isImmersive ? { 
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))'
        } : undefined}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl w-full ${
            isImmersive ? 'max-w-2xl max-h-[85vh] overflow-y-auto' : 'max-w-lg'
          }`}
        >
          <div className={`p-6 ${isImmersive ? 'p-4' : ''}`}>
            <div className="flex justify-between items-center mb-3">
              {queueTotal > 1 && (
                <div className="text-xs text-gray-400" data-testid="roleplay-queue-indicator">
                  Roleplay {queuePosition} of {queueTotal}
                </div>
              )}
              {attemptsUsed > 0 && (
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  attemptsRemaining === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700 text-gray-300'
                }`} data-testid="roleplay-attempts-indicator">
                  {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Mic className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" data-testid="roleplay-title">
                  Practice Time
                </h3>
                <p className="text-sm text-gray-400">{roleplay.context}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">The homeowner says:</p>
              <p className="text-xl font-semibold text-white italic" data-testid="roleplay-objection">
                "{roleplay.objection}"
              </p>
            </div>

            <div className={`grid gap-3 mb-4 ${isImmersive ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div className="bg-green-900/20 rounded-lg p-3 border border-green-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-green-400">To Pass</span>
                </div>
                <p className="text-sm text-gray-300" data-testid="roleplay-pass-criteria">
                  {roleplay.passCriteria}
                </p>
              </div>
              
              <div className="bg-red-900/20 rounded-lg p-3 border border-red-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-medium text-red-400">Avoid</span>
                </div>
                <p className="text-sm text-gray-300" data-testid="roleplay-fail-conditions">
                  {roleplay.failConditions}
                </p>
              </div>
            </div>

            <div className={`flex gap-3 ${isImmersive ? 'flex-row' : 'flex-col sm:flex-row'}`}>
              <Button
                onClick={onStart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                data-testid="button-start-roleplay"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Roleplay
              </Button>
              <Button
                onClick={onSkip}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
                data-testid="button-skip-roleplay"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip for Later
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              You can complete skipped roleplays at the end of the chapter
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
