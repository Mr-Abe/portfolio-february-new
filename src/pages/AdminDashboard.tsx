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
import { Download, Search, Mail, Eye, Archive, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'archived';
}

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Submission;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof Submission) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleStatusChange = async (id: string, status: 'read' | 'unread' | 'archived') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(sub =>
        sub.id === id ? { ...sub, status } : sub
      ));
    } catch (err) {
      setError('Failed to update status');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.filter(sub => sub.id !== id));
    } catch (err) {
      setError('Failed to delete submission');
      console.error('Error:', err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Message', 'Status', 'Created At'];
    const csvData = submissions.map(sub => [
      sub.name,
      sub.email,
      sub.message,
      sub.status,
      format(new Date(sub.created_at), 'PPpp')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contact-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const filteredSubmissions = submissions
    .filter(sub =>
      Object.values(sub).some(value =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      return aValue > bValue ? direction : -direction;
    });

  const paginatedSubmissions = filteredSubmissions.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Submissions
              </h1>
              <div className="flex gap-4">
                <Button
                  onClick={exportToCSV}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Download size={16} />
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search submissions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                        <TableHead
                          onClick={() => handleSort('created_at')}
                          className="cursor-pointer"
                        >
                          Date
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort('name')}
                          className="cursor-pointer"
                        >
                          Name
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort('email')}
                          className="cursor-pointer"
                        >
                          Email
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort('status')}
                          className="cursor-pointer"
                        >
                          Status
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubmissions.map((submission) => (
                        <TableRow
                          key={submission.id}
                          className={submission.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        >
                          <TableCell>
                            {format(new Date(submission.created_at), 'PPpp')}
                          </TableCell>
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
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(
                                  submission.id,
                                  submission.status === 'unread' ? 'read' : 'unread'
                                )}
                              >
                                {submission.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(submission.id, 'archived')}
                              >
                                <Archive size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 dark:text-red-400"
                                onClick={() => handleDelete(submission.id)}
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
                  count={filteredSubmissions.length}
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
    </div>
  );
};

export default AdminDashboard;