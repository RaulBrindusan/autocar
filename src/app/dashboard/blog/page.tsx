'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { onBlogPostsSnapshot, deleteBlogPost, updateBlogPost } from '@/lib/firebase/firestore';
import { BlogPost } from '@/lib/types';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export default function BlogPage() {
  return (
    <ProtectedRoute>
      <BlogContent />
    </ProtectedRoute>
  );
}

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper function to strip HTML tags safely using regex
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&')  // Replace &amp; with &
      .replace(/&lt;/g, '<')   // Replace &lt; with <
      .replace(/&gt;/g, '>')   // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .trim();
  };

  useEffect(() => {
    const unsubscribe = onBlogPostsSnapshot((updatedPosts) => {
      setPosts(updatedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = () => {
    router.push('/dashboard/blog/new');
  };

  const handleEditPost = (postId: string) => {
    router.push(`/dashboard/blog/${postId}`);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Sigur doriți să ștergeți această postare?')) {
      await deleteBlogPost(postId);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    await updateBlogPost(post.id, { published: !post.published });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6" />

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Creează și gestionează postări de blog</p>
      </div>

      {/* Add Post Button */}
      <div className="mb-6">
        <button
          onClick={handleAddPost}
          className="w-full sm:w-auto bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Adaugă Postare</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Se încarcă postările...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nicio postare adăugată
          </h3>
          <p className="text-gray-600 mb-4">
            Începe prin a adăuga prima ta postare de blog
          </p>
          <button
            onClick={handleAddPost}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adaugă Postare
          </button>
        </div>
      )}

      {/* Posts List */}
      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="md:w-64 md:flex-shrink-0">
                    <div className="relative h-48 md:h-full w-full">
                      <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                      <p className="text-sm text-gray-600 mb-2">
                        De: {post.author} | {new Date(post.timestamp).toLocaleDateString('ro-RO')}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Publicat' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                  {/* View Post Link */}
                  {post.published && post.slug && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Vizualizează postarea"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  )}

                  {/* Publish/Unpublish Toggle */}
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                      post.published
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={post.published ? 'Retrage din publicare' : 'Publică'}
                  >
                    {post.published ? '✓ Publicat' : 'Publică'}
                  </button>
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editează"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Șterge"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-3">
                    {stripHtml(post.content).substring(0, 300)}
                    {stripHtml(post.content).length > 300 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
