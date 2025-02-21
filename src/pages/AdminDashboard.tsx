import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TablePagination,
} from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { supabase } from '../lib/supabaseClient';
import {
  Download,
  Search,
  Mail,
  Eye,
  Archive,
  Trash2,
  Plus,
  Edit3,
} from 'lucide-react';
import { format } from 'date-fns';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'archived';
}

interface Project {
  id?: string; // id is optional for new projects
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  status: 'draft' | 'published' | 'archived';
}

interface Post {
  id?: string; // id is optional for new posts
  title: string;
  excerpt: string;
  created_at?: string;
  updated_at?: string;
  status: 'draft' | 'published' | 'archived';
}

type TabType = 'submissions' | 'projects' | 'posts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('submissions');

  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Selected records for viewing/editing
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // UI/UX states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc',
  });

  useEffect(() => {
    // Reset to first page on tab switch
    setPage(0);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'submissions') {
        await fetchSubmissions();
      } else if (activeTab === 'projects') {
        await fetchProjects();
      } else {
        await fetchPosts();
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ FETCH FUNCTIONS ------------------
  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setSubmissions(data as Submission[]);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setProjects(data as Project[]);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setPosts(data as Post[]);
  };

  // ------------------ SORTING & SEARCH ------------------
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const applySorting = <T extends Record<string, any>>(items: T[]) => {
    const { key, direction } = sortConfig;
    return [...items].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      const dir = direction === 'asc' ? 1 : -1;
      if (aVal > bVal) return dir;
      if (aVal < bVal) return -dir;
      return 0;
    });
  };

  const applySearch = <T extends Record<string, any>>(items: T[]) => {
    if (!search) return items;
    return items.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  // ------------------ SUBMISSIONS ACTIONS ------------------
  const handleUpdateSubmissionStatus = async (id: string, status: Submission['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      setSubmissions(submissions.map(s => (s.id === id ? { ...s, status } : s)));
    } catch (err) {
      setError('Failed to update submission status');
      console.error(err);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
      setSubmissions(submissions.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete submission');
      console.error(err);
    }
  };

  const exportSubmissionsToCSV = () => {
    const headers = ['Name', 'Email', 'Message', 'Status', 'Created At'];
    const csvData = submissions.map(sub => [
      sub.name,
      sub.email,
      sub.message,
      sub.status,
      format(new Date(sub.created_at), 'PPpp'),
    ]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contact-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  // ------------------ PROJECTS ACTIONS ------------------
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    }
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;
    try {
      if (selectedProject.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: selectedProject.title,
            description: selectedProject.description,
            status: selectedProject.status,
          })
          .eq('id', selectedProject.id);
        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert({
            title: selectedProject.title,
            description: selectedProject.description,
            status: selectedProject.status,
          });
        if (error) throw error;
      }
      await fetchProjects();
      setSelectedProject(null);
    } catch (err) {
      setError('Failed to save project');
      console.error(err);
    }
  };

  // ------------------ POSTS ACTIONS ------------------
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  const handleSavePost = async () => {
    if (!selectedPost) return;
    try {
      if (selectedPost.id) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            title: selectedPost.title,
            excerpt: selectedPost.excerpt,
            status: selectedPost.status,
          })
          .eq('id', selectedPost.id);
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert({
            title: selectedPost.title,
            excerpt: selectedPost.excerpt,
            status: selectedPost.status,
          });
        if (error) throw error;
      }
      await fetchPosts();
      setSelectedPost(null);
    } catch (err) {
      setError('Failed to save post');
      console.error(err);
    }
  };

  // ------------------ RENDER LOGIC ------------------
  let typedData: Submission[] | Project[] | Post[] = [];
  if (activeTab === 'submissions') {
    typedData = applySorting(applySearch(submissions));
  } else if (activeTab === 'projects') {
    typedData = applySorting(applySearch(projects));
  } else {
    typedData = applySorting(applySearch(posts));
  }
  const pageStart = page * rowsPerPage;
  const displayedData = typedData.slice(pageStart, pageStart + rowsPerPage);
  const totalItems = typedData.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Tabs / Navigation */}
          <div className="flex gap-4 mb-6">
            <Button variant={activeTab === 'submissions' ? 'default' : 'outline'} onClick={() => setActiveTab('submissions')}>
              Submissions
            </Button>
            <Button variant={activeTab === 'projects' ? 'default' : 'outline'} onClick={() => setActiveTab('projects')}>
              Projects
            </Button>
            <Button variant={activeTab === 'posts' ? 'default' : 'outline'} onClick={() => setActiveTab('posts')}>
              Posts
            </Button>
          </div>

          {/* Header & Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{activeTab}</h1>
              {activeTab === 'submissions' && (
                <Button onClick={exportSubmissionsToCSV} variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Export CSV
                </Button>
              )}
              {(activeTab === 'projects' || activeTab === 'posts') && (
                <Button
                  onClick={() => {
                    if (activeTab === 'projects') {
                      setSelectedProject({ title: '', description: '', status: 'draft' });
                    } else {
                      setSelectedPost({ title: '', excerpt: '', status: 'draft' });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add {activeTab === 'projects' ? 'Project' : 'Post'}
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {activeTab === 'submissions' && (
                          <>
                            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer">
                              Date
                            </TableHead>
                            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                              Name
                            </TableHead>
                            <TableHead onClick={() => handleSort('email')} className="cursor-pointer">
                              Email
                            </TableHead>
                            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                              Status
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </>
                        )}
                        {activeTab === 'projects' && (
                          <>
                            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer">
                              Created
                            </TableHead>
                            <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
                              Title
                            </TableHead>
                            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                              Status
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </>
                        )}
                        {activeTab === 'posts' && (
                          <>
                            <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer">
                              Created
                            </TableHead>
                            <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
                              Title
                            </TableHead>
                            <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                              Status
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeTab === 'submissions' &&
                        (displayedData as Submission[]).map(submission => (
                          <TableRow
                            key={submission.id}
                            className={submission.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                          >
                            <TableCell>{format(new Date(submission.created_at), 'PPpp')}</TableCell>
                            <TableCell>{submission.name}</TableCell>
                            <TableCell>
                              <a
                                href={`mailto:${submission.email}`}
                                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <Mail size={16} />
                                {submission.email}
                              </a>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  submission.status === 'unread'
                                    ? 'default'
                                    : submission.status === 'read'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {submission.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedSubmission(submission)}>
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleUpdateSubmissionStatus(
                                      submission.id,
                                      submission.status === 'unread' ? 'read' : 'unread'
                                    )
                                  }
                                >
                                  {submission.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUpdateSubmissionStatus(submission.id, 'archived')}
                                >
                                  <Archive size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleDeleteSubmission(submission.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      {activeTab === 'projects' &&
                        (displayedData as Project[]).map(project => (
                          <TableRow key={project.id}>
                            <TableCell>
                              {format(new Date(project.created_at ?? new Date().toISOString()), 'PPpp')}
                            </TableCell>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  project.status === 'draft'
                                    ? 'default'
                                    : project.status === 'published'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedProject(project)}>
                                  <Edit3 size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleDeleteProject(project.id!)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      {activeTab === 'posts' &&
                        (displayedData as Post[]).map(post => (
                          <TableRow key={post.id}>
                            <TableCell>
                              {format(new Date(post.created_at ?? new Date().toISOString()), 'PPpp')}
                            </TableCell>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  post.status === 'draft'
                                    ? 'default'
                                    : post.status === 'published'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {post.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedPost(post)}>
                                  <Edit3 size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleDeletePost(post.id!)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  component="div"
                  count={totalItems}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
                />
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* ---------------- MODALS ---------------- */}
      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title="Submission Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedSubmission.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedSubmission.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {selectedSubmission.message}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {format(new Date(selectedSubmission.created_at), 'PPpp')}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Project Create/Edit Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.id ? 'Edit Project' : 'Add Project'}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</label>
              <Input
                value={selectedProject.title}
                onChange={e =>
                  setSelectedProject({ ...selectedProject, title: e.target.value })
                }
                placeholder="Project Title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
              <Input
                value={selectedProject.description}
                onChange={e =>
                  setSelectedProject({ ...selectedProject, description: e.target.value })
                }
                placeholder="Project Description"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
              <select
                value={selectedProject.status}
                onChange={e =>
                  setSelectedProject({
                    ...selectedProject,
                    status: e.target.value as Project['status'],
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject}>Save</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Post Create/Edit Modal */}
      {selectedPost && (
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title={selectedPost.id ? 'Edit Post' : 'Add Post'}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</label>
              <Input
                value={selectedPost.title}
                onChange={e =>
                  setSelectedPost({ ...selectedPost, title: e.target.value })
                }
                placeholder="Post Title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Excerpt</label>
              <Input
                value={selectedPost.excerpt}
                onChange={e =>
                  setSelectedPost({ ...selectedPost, excerpt: e.target.value })
                }
                placeholder="Post Excerpt"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
              <select
                value={selectedPost.status}
                onChange={e =>
                  setSelectedPost({
                    ...selectedPost,
                    status: e.target.value as Post['status'],
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setSelectedPost(null)}>
                Cancel
              </Button>
              <Button onClick={handleSavePost}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
