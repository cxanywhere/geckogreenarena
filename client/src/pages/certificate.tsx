import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";

interface CertificateData {
  name: string;
  certifiedAt: string;
  warriorAvatar: string | null;
  profilePhoto: string | null;
}

export default function CertificatePage() {
  const { token } = useParams<{ token: string }>();

  const { data: certificate, isLoading, error } = useQuery<CertificateData>({
    queryKey: ["certificate", token],
    queryFn: async () => {
      const res = await fetch(`/api/certificate/${token}`);
      if (!res.ok) {
        throw new Error("Certificate not found");
      }
      return res.json();
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-magenta text-xl">Loading certificate...</div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h1>
          <p className="text-gray-400">This certificate link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const certDate = new Date(certificate.certifiedAt);
  const formattedDate = certDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-magenta/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-magenta/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] rounded-3xl" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-magenta/10 border border-magenta/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-magenta text-sm font-medium tracking-wider uppercase">Official Certificate</span>
              </div>
              
              <div className="text-6xl mb-4">🏆</div>
              
              <h2 className="text-magenta text-sm font-semibold tracking-[0.3em] uppercase mb-2">This Certifies That</h2>
              
              <div className="flex justify-center mb-6">
                {(certificate.warriorAvatar || certificate.profilePhoto) && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-magenta to-blue-400 rounded-full blur-md opacity-50" />
                    <img
                      src={certificate.warriorAvatar || certificate.profilePhoto || ''}
                      alt={certificate.name}
                      className="relative w-24 h-24 rounded-full object-cover border-3 border-magenta"
                    />
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {certificate.name}
              </h1>
              
              <p className="text-gray-400 text-lg mb-8">
                Has successfully completed all requirements and is hereby recognized as a
              </p>
              
              <div className="bg-gradient-to-r from-magenta/20 via-blue-400/30 to-magenta/20 rounded-2xl p-6 mb-8 border border-magenta/30">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-magenta to-blue-300 tracking-tight">
                  Certified Sales Champion
                </h3>
                <p className="text-magenta/80 text-sm mt-2 font-medium tracking-wider uppercase">LMS Certified Seller</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-white font-bold">100%</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Chapters</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-white font-bold">16+</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Roleplays</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-white font-bold">75%+</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Quiz Avg</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                <div>
                  <span className="text-gray-600">Certified On:</span>{" "}
                  <span className="text-white font-medium">{formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-magenta font-bold text-xl tracking-tight">LinkedIn Marketing Solutions</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 font-medium">Sales Enablement</span>
              </div>
              <p className="text-center text-gray-600 text-xs mt-2">
                Powered by AI-driven sales training technology
              </p>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-magenta/30 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-magenta/30 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-magenta/30 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-magenta/30 rounded-br-xl" />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Verify this certificate at{" "}
            <span className="text-magenta">linkedin.com/marketing-solutions</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
