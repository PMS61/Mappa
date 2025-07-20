"use client";
import Navbar from "./navbar.jsx";
import React from "react";
import {
  FaRocket,
  FaSignInAlt,
  FaLock,
  FaBolt,
  FaRobot,
  FaCheckCircle,
} from "react-icons/fa";

const plans = [
  {
    name: "Free",
    description: "Access core features with limited usage.",
    features: ["Basic IDE", "Limited Repositories", "Community Support"],
    style: "from-blue-500 to-blue-600",
  },
  {
    name: "Pro",
    description: "Unlimited access to all features.",
    features: ["Unlimited IDE", "Unlimited Repositories", "Priority Support"],
    style: "from-purple-500 to-purple-600",
  },
  {
    name: "Enterprise",
    description: "Customize features for your team.",
    features: ["Custom Features", "Dedicated Server", "Premium Support"],
    style: "from-indigo-500 to-indigo-600",
  },
];

const features = [
  { title: "Secure", icon: <FaLock />, desc: "Your data is safe with us" },
  { title: "Fast", icon: <FaBolt />, desc: "Lightning quick syncing" },
  {
    title: "AI Chatbot",
    icon: <FaRobot />,
    desc: "MappaAI always at your service",
  },
];

const ctaButtons = [
  {
    title: "Get Started",
    description: "Create your account and join us today!",
    icon: <FaRocket />,
    link: "/register",
    style: "from-blue-50 to-blue-100 dark:from-blue-700 dark:to-blue-600",
    hoverStyle: "hover:shadow-blue-300/50",
  },
  {
    title: "Already a Member?",
    description: "Login to access your dashboard",
    icon: <FaSignInAlt />,
    link: "/login",
    style: "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600",
    hoverStyle: "hover:shadow-gray-400/50",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <Navbar />

        <header className="text-center mt-16 md:mt-24">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fadeIn dark:from-blue-400 dark:to-purple-400">
            Mappa
          </h1>
          <p
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fadeIn dark:text-gray-400"
            style={{ animationDelay: "0.2s" }}
          >
            A web-based IDE for seamless real-time collaboration, intelligent
            conflict resolution, and structured project management.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
          {ctaButtons.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`bg-gradient-to-br ${item.style} p-8 rounded-2xl
                       shadow-lg hover:shadow-xl ${item.hoverStyle} transition-all duration-300
                       transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700
                       animate-fadeIn flex flex-col items-center text-center`}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <span className="text-5xl mb-4 text-blue-600 dark:text-blue-400">
                {item.icon}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </a>
          ))}
        </div>

        <section className="mt-24 md:mt-32">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 animate-fadeIn"
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <span className="text-4xl mb-4 inline-block text-purple-600 dark:text-purple-400">
                  {feature.icon}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 md:mt-32 text-center">
          <h2 className="text-4xl font-bold mb-12">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${plan.style} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-500/50 hover:scale-105 text-white`}
              >
                <h3 className="text-3xl font-bold text-center">{plan.name}</h3>
                <p className="text-gray-200 text-center mt-2 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg">
                      <FaCheckCircle className="text-green-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer
          className="text-center mt-24 pb-8 text-gray-500 animate-fadeIn dark:text-gray-400"
          style={{ animationDelay: "0.8s" }}
        >
          <p>© 2024 Mappa. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Page;
