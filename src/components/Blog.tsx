import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { blogPosts } from '../data';

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const tags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = selectedTag === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.tags.includes(selectedTag));

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Technical Insights</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Exploring software engineering concepts, best practices, and industry trends
            through detailed technical articles and tutorials.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              selectedTag === 'all'
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Posts
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                selectedTag === tag
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                    >
                      <Tag size={14} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Clock size={16} className="mr-1" />
                    {post.readTime} min read
                  </div>
                  <a
                    href={post.url}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    Read More
                    <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;