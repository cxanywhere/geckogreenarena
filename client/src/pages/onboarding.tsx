import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, ArrowRight, Sparkles, Shield, Sword, Check, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import monetateLogoDark from "@/assets/monetate-logo-dark.png";
import monetateLogoLight from "@/assets/monetate-logo-light.png";
import { useTheme } from "next-themes";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { user, updateUser, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const [step, setStep] = useState<"name" | "photo" | "generating" | "complete">("name");
  const [name, setName] = useState(user?.name || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [warriorAvatar, setWarriorAvatar] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const monetateLogo = resolvedTheme === "dark" ? monetateLogoDark : monetateLogoLight;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      setShowCamera(true);
      
      // Wait for next render cycle so video element is in DOM
      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Explicitly play the video for mobile browsers
          try {
            await videoRef.current.play();
          } catch (playError) {
            console.log("Video autoplay handled by browser");
          }
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Could not access camera. Please try uploading a photo instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        toast.error("Camera not ready. Please wait a moment and try again.");
        return;
      }
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPhotoPreview(dataUrl);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            setPhotoFile(file);
          }
        }, "image/jpeg", 0.8);
        
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setStep("photo");
  };

  const generateWarriorAvatar = async () => {
    if (!photoFile) {
      toast.error("Please take or upload a photo first");
      return;
    }

    setStep("generating");
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("name", name);
      formData.append("userId", user?.id || "");

      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/onboarding/generate-warrior", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate warrior avatar");
      }

      const data = await response.json();
      setWarriorAvatar(data.warriorAvatar);
      
      if (updateUser) {
        updateUser({
          ...user!,
          name,
          profilePhoto: data.profilePhoto,
          warriorAvatar: data.warriorAvatar,
          status: "active",
        });
      }

      setStep("complete");
    } catch (error) {
      console.error("Error generating warrior avatar:", error);
      toast.error("Failed to generate your Arena Avatar. Please try again.");
      setStep("photo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    if (user?.role === "director") {
      setLocation("/admin-dashboard");
    } else if (user?.role === "manager") {
      setLocation("/manager-dashboard");
    } else {
      setLocation("/dashboard");
    }
  };

  const handleSignOut = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-magenta/5 flex items-center justify-center p-4 relative">
      {/* Sign Out Button - Fixed in top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-2 text-muted-foreground hover:text-foreground"
          data-testid="button-signout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={monetateLogo} alt="Monetate" className="h-12 w-12 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                Monetate
              </span>
              <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest">Sales Enablement</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Arena!</h1>
          <p className="text-muted-foreground">Let's set up your profile and create your Arena Avatar</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5">
            <Shield className="w-32 h-32 text-magenta" />
          </div>

          <AnimatePresence mode="wait">
            {step === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-magenta">1</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Confirm Your Name</h2>
                    <p className="text-sm text-muted-foreground">How should we call you in the arena?</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="text-lg"
                    data-testid="input-name"
                  />
                </div>

                <Button 
                  onClick={handleNameSubmit} 
                  className="w-full gap-2"
                  size="lg"
                  data-testid="button-continue-name"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === "photo" && (
              <motion.div
                key="photo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-magenta/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-magenta">2</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Your Photo</h2>
                    <p className="text-sm text-muted-foreground">Take or upload a photo for your Arena Avatar</p>
                  </div>
                </div>

                {showCamera ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={stopCamera} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={capturePhoto} className="flex-1 gap-2">
                        <Camera className="w-4 h-4" /> Capture
                      </Button>
                    </div>
                  </div>
                ) : photoPreview ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden aspect-square">
                      <img 
                        src={photoPreview} 
                        alt="Your photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }} 
                      variant="outline" 
                      className="w-full"
                    >
                      Take a Different Photo
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={startCamera}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-magenta hover:bg-magenta/5 transition-all flex flex-col items-center justify-center gap-3 group"
                      data-testid="button-camera"
                    >
                      <div className="w-16 h-16 rounded-full bg-magenta/10 flex items-center justify-center group-hover:bg-magenta/20 transition-colors">
                        <Camera className="w-8 h-8 text-magenta" />
                      </div>
                      <span className="font-medium text-foreground">Take Photo</span>
                      <span className="text-xs text-muted-foreground">Use your camera</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-magenta hover:bg-magenta/5 transition-all flex flex-col items-center justify-center gap-3 group"
                      data-testid="button-upload"
                    >
                      <div className="w-16 h-16 rounded-full bg-magenta/10 flex items-center justify-center group-hover:bg-magenta/20 transition-colors">
                        <Upload className="w-8 h-8 text-magenta" />
                      </div>
                      <span className="font-medium text-foreground">Upload Photo</span>
                      <span className="text-xs text-muted-foreground">From your device</span>
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file"
                />

                <canvas ref={canvasRef} className="hidden" />

                {photoPreview && (
                  <Button 
                    onClick={generateWarriorAvatar}
                    className="w-full gap-2"
                    size="lg"
                    data-testid="button-generate"
                  >
                    <Sparkles className="w-4 h-4" /> Generate My Arena Avatar
                  </Button>
                )}
              </motion.div>
            )}

            {step === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-4 border-magenta/20 animate-pulse" />
                  <div className="absolute inset-2 rounded-full border-4 border-t-magenta border-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sword className="w-12 h-12 text-magenta animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Creating Your Arena Avatar</h2>
                  <p className="text-muted-foreground">Our AI is crafting your look...</p>
                </div>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-6"
              >
                <div className="relative mx-auto w-40 h-40">
                  {warriorAvatar ? (
                    <img 
                      src={warriorAvatar} 
                      alt="Your Arena Avatar" 
                      className="w-full h-full object-cover rounded-full border-4 border-magenta shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-magenta/10 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-magenta" />
                    </div>
                  )}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Welcome to the Arena, {name}!</h2>
                  <p className="text-muted-foreground">Your Arena Avatar is ready. Time to start training!</p>
                </div>

                <Button 
                  onClick={handleComplete}
                  className="w-full gap-2"
                  size="lg"
                  data-testid="button-enter-arena"
                >
                  <Sword className="w-4 h-4" /> Enter the Arena
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {["name", "photo", "complete"].map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s || (step === "generating" && s === "photo")
                    ? "bg-magenta"
                    : i < ["name", "photo", "complete"].indexOf(step === "generating" ? "photo" : step)
                    ? "bg-magenta/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
