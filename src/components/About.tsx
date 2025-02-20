import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Code2 } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    date: '2023 - Present',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    description: 'Leading distributed systems development and cloud architecture initiatives.',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: 2,
    date: '2021 - 2023',
    title: 'Software Engineer',
    company: 'Data Systems Corp',
    description: 'Developed scalable machine learning pipelines and microservices architecture.',
    icon: <Code2 className="w-6 h-6" />,
  },
  {
    id: 3,
    date: '2021',
    title: 'M.S. Computer Science',
    company: 'Stanford University',
    description: 'Specialized in Artificial Intelligence and Distributed Systems.',
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    id: 4,
    date: '2020',
    title: 'Outstanding Achievement Award',
    company: 'ACM Conference',
    description: 'Recognized for contributions to distributed systems research.',
    icon: <Award className="w-6 h-6" />,
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            I'm a passionate software engineer with expertise in distributed systems and machine learning.
            My journey in technology has been driven by a desire to solve complex problems and create
            innovative solutions that make a difference.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

            {/* Timeline items */}
            {timelineData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`mb-12 flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="mb-1 text-sm font-semibold text-blue-600 dark:text-blue-400">{item.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">{item.company}</div>
                  <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-lg">
                    {item.icon}
                  </div>
                </div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;