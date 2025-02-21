import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code2, GraduationCap, Award } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    date: '2023 – Present',
    title: 'Assistant Educator & Curriculum Developer',
    company: "St. Mary's Early Learning Center",
    description:
      'Design and facilitate Reggio-Emilia inspired lesson plans while integrating EdTech solutions. Collaborate with administrators to incorporate digital literacy into early childhood programs, enhancing engagement and foundational STEM skills.',
    icon: <Award className="w-6 h-6" />,
  },
  {
    id: 2,
    date: '2022 – 2023',
    title: 'Back End Engineer (Intern)',
    company: 'Lyft',
    description:
      'Developed and refactored microservices using Python and TDD practices. Improved code maintainability by 30% and increased unit test coverage to 85%. Collaborated with cross-functional teams to optimize continuous integration pipelines.',
    icon: <Code2 className="w-6 h-6" />,
  },
  {
    id: 3,
    date: '2020 – 2022',
    title: 'Academician of Computer Science',
    company: 'The University of Texas at San Antonio',
    description:
      'Completed an intensive apprenticeship focusing on AI/ML and software engineering fundamentals. Gained hands-on experience in Spring Boot, SQL, and Cloud Computing. Collaborated on Scrum teams, developing full-stack projects and honing software quality assurance practices.',
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    id: 4,
    date: '2018 – 2020',
    title: 'Senior Training & Development Specialist',
    company: 'Leidos',
    description:
      'Led organizational development initiatives, designing leadership programs that improved team performance by 15%. Conducted training needs analyses and aligned curricula with business objectives. Partnered with a cross-functional software development team to integrate new learning solutions into enterprise systems.',
    icon: <Briefcase className="w-6 h-6" />,
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            I’m a multidisciplinary professional bridging healthcare, technology, and education.
            After years of service in training and organizational leadership, I shifted to software
            engineering and AI/ML—always driven by a passion for improving learning outcomes,
            patient care, and operational efficiency in healthcare and EdTech settings.
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
                  <div className="mb-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {item.date}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                    {item.company}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
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