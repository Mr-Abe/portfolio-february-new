import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Database, Terminal } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Software Engineer & 
              <span className="text-blue-600 dark:text-blue-400"> Problem Solver</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Passionate about building scalable systems and creating innovative solutions.
              Specializing in distributed systems, cloud architecture, and machine learning.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View Projects
                <ArrowRight className="ml-2" size={20} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                Contact Me
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <TechCard
              icon={<Code2 size={32} />}
              title="Frontend Development"
              description="React, TypeScript, and modern web technologies"
            />
            <TechCard
              icon={<Terminal size={32} />}
              title="Backend Systems"
              description="Node.js, Python, and distributed systems"
            />
            <TechCard
              icon={<Database size={32} />}
              title="Cloud Architecture"
              description="AWS, Docker, and Kubernetes"
            />
            <TechCard
              title="Machine Learning"
              description="TensorFlow, PyTorch, and data pipelines"
              icon={<Terminal size={32} />}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TechCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="text-blue-600 dark:text-blue-400 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

export default Hero;