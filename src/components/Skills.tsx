import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../data';

const Skills = () => {
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Technical Skills</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
            across various technologies and tools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 capitalize">
                {category}
              </h3>
              <div className="space-y-6">
                {skills
                  .filter(skill => skill.category === category)
                  .map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;