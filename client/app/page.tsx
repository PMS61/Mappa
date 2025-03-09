"use client";
import Navbar from "./navbar.jsx";
import React from "react";

const plans = [
  {
    name: "Free",
    description: "Access core features with limited usage.",
    features: ["Basic IDE", "Limited Repositories", "Community Support"],
    style: "from-blue-600 to-purple-700",
  },
  {
    name: "Pro",
    description: "Unlimited access to all features.",
    features: ["Unlimited IDE", "Unlimited Repositories", "Priority Support"],
    style: "from-purple-600 to-indigo-700",
  },
  {
    name: "Enterprise",
    description: "Customize features for your team.",
    features: ["Custom Features", "Dedicated Server", "Premium Support"],
    style: "from-indigo-600 to-violet-700",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:from-[#1a1a2e] dark:via-[#1a1a2e] dark:to-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="text-center mt-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-8 animate-fadeIn dark:from-blue-500 dark:to-purple-500">
            Mappa ✨
          </h1>
          <p
            className="text-3xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fadeIn dark:text-blue-300"
            style={{ animationDelay: "0.2s" }}
          >
            A Web-based IDE that ensures seamless real-time collaboration,
            intelligent conflict resolution, structured project management, and
            offline editing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          {[
            {
              title: "Get Started",
              description: "Create your account and join us today!",
              icon: "🚀",
              link: "/register",
              style:
                "from-blue-50 to-blue-100 dark:from-blue-700 dark:to-blue-500",
            },
            {
              title: "Already a Member?",
              description: "Login to access your dashboard",
              icon: "✨",
              link: "/login",
              style:
                "from-green-50 to-green-100 dark:from-purple-700 dark:to-purple-500",
            },
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`bg-gradient-to-br ${item.style} p-8 rounded-2xl
                       shadow-lg hover:shadow-xl transition-all duration-300
                       transform hover:-translate-y-1 border border-yellow-100 dark:border-blue-700
                       animate-fadeIn flex flex-col items-center text-center`}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <span className="text-5xl mb-4">{item.icon}</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-200">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Secure", icon: "🔒", desc: "Your data is safe with us" },
            { title: "Fast", icon: "⚡", desc: "Lightning quick syncing" },
            { title: "AI Chatbot", icon: "💬", desc: "MappaAI always at your service" },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 animate-fadeIn"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <span className="text-4xl mb-4 inline-block">{feature.icon}</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${plan.style} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-500 hover:scale-105`}
            >
              <h2 className="text-3xl font-bold text-center">{plan.name}</h2>
              <p className="text-gray-200 text-center mt-2">{plan.description}</p>
              <ul className="mt-4 text-gray-300">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-lg">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer
          className="text-center mt-24 text-gray-600 animate-fadeIn dark:text-gray-400"
          style={{ animationDelay: "0.8s" }}
        >
          <p>© 2024 Our Platform. All rights reserved. ✨</p>
        </footer>
      </div>
    </div>
  );
};

export default Page;
