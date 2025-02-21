import { Project, Skill, BlogPost } from './types';

export const projects: Project[] = [
  {
    id: 'distributed-systems',
    title: 'Distributed Systems Simulator',
    description: 'A comprehensive simulator for distributed systems, implementing various consensus algorithms and fault tolerance mechanisms.',
    technologies: ['Python', 'Docker', 'gRPC', 'Redis'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    githubUrl: 'https://github.com/yourusername/distributed-systems',
    featured: true
  },
  {
    id: 'ml-pipeline',
    title: 'ML Pipeline Orchestrator',
    description: 'End-to-end machine learning pipeline orchestrator with automated model training and deployment capabilities.',
    technologies: ['TensorFlow', 'Kubernetes', 'Python', 'AWS'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
    githubUrl: 'https://github.com/yourusername/ml-pipeline',
    featured: true
  }
];

export const skills: Skill[] = [
  { name: 'TypeScript', category: 'languages', level: 70 },
  { name: 'Python', category: 'languages', level: 85 },
  { name: 'React', category: 'frameworks', level: 90 },
  { name: 'Node.js', category: 'frameworks', level: 75 },
  { name: 'Docker', category: 'tools', level: 72 },
  { name: 'AWS', category: 'tools', level: 70 }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'distributed-systems-consensus',
    title: 'Understanding Distributed Systems Consensus',
    excerpt: 'A deep dive into consensus algorithms like Raft and Paxos, with practical implementation examples.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    tags: ['Distributed Systems', 'Architecture'],
    readTime: 12,
    url: '/blog/distributed-systems-consensus',
    date: '2024-03-15'
  },
  {
    id: 'ml-deployment-best-practices',
    title: 'Best Practices for ML Model Deployment',
    excerpt: 'Learn how to effectively deploy and monitor machine learning models in production.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
    tags: ['Machine Learning', 'DevOps'],
    readTime: 8,
    url: '/blog/ml-deployment-best-practices',
    date: '2024-03-10'
  },
  {
    id: 'react-performance-optimization',
    title: 'Advanced React Performance Optimization',
    excerpt: 'Techniques and strategies for optimizing React applications for better performance.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    tags: ['React', 'Performance'],
    readTime: 10,
    url: '/blog/react-performance-optimization',
    date: '2024-03-05'
  }
];