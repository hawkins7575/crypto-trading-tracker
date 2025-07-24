import React from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { Github } from 'lucide-react';

const Login: React.FC = () => {
  const { signIn } = useAuthActions();

  const handleGitHubSignIn = () => {
    void signIn("github");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Crypto Trading Tracker
          </h1>
          <p className="text-gray-300">
            암호화폐 거래를 추적하고 분석하세요
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGitHubSignIn}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
          >
            <Github size={20} />
            GitHub로 로그인
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            로그인하여 개인 거래 데이터를 안전하게 관리하세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;