'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Road Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-800 opacity-10">
        <div className="absolute top-1/2 left-0 right-0 h-1 border-t-4 border-dashed border-white opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-2xl w-full text-center">
          {/* Car Image */}
          <div className="mb-8 relative">
            <div className="inline-block animate-bounce-slow">
              <Image
                src="/car99.png"
                alt="Car 404"
                width={256}
                height={256}
                className="w-48 h-48 md:w-64 md:h-64 mx-auto drop-shadow-2xl object-contain"
                priority
              />
            </div>

            {/* Smoke/Dust particles */}
            <div className="absolute bottom-0 left-1/4 w-8 h-8 bg-gray-300 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute bottom-0 right-1/4 w-6 h-6 bg-gray-300 rounded-full opacity-50 animate-ping animation-delay-1000"></div>
          </div>

          {/* 404 Error with Gradient Text */}
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-gradient drop-shadow-lg">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fade-in drop-shadow-md">
            Ups! Drumul s-a terminat
          </h2>

          <p className="text-gray-700 text-base md:text-lg mb-8 max-w-lg mx-auto animate-fade-in-delay drop-shadow-sm">
            Se pare că te-ai rătăcit pe drum. Pagina pe care o cauți nu există sau a fost mutată către o altă destinație.
          </p>

          {/* Action Button */}
          <div className="animate-fade-in-delay-2 mb-8">
            <Link
              href="/"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Înapoi Acasă
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="pt-6">
            <p className="text-gray-700 drop-shadow-sm">
              Ai nevoie de ajutor?{' '}
              <a
                href="mailto:contact@automode.ro"
                className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-wavy decoration-blue-300 hover:decoration-blue-500 transition-colors"
              >
                Contactează-ne
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
