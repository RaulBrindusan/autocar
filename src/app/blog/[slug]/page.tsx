'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { onBlogPostsSnapshot } from '@/lib/firebase/firestore';
import { BlogPost } from '@/lib/types';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const unsubscribe = onBlogPostsSnapshot((posts) => {
      const foundPost = posts.find(
        (p) => p.slug === params.slug && p.published
      );

      if (foundPost) {
        setPost(foundPost);
        const related = posts
          .filter(
            (p) =>
              p.published &&
              p.id !== foundPost.id &&
              p.category === foundPost.category
          )
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        router.push('/blog');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.slug, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Se încarcă articolul...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs className="mb-6" />
          {post.category && (
            <Link
              href="/blog"
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors mb-4"
            >
              {post.category}
            </Link>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 text-sm mb-8 pb-8 border-b border-gray-200">
            <time>
              {new Date(post.timestamp).toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>
          {post.featuredImage && (
            <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          )}
          <div
            className="blog-content"
            style={{ fontFamily: '"Times New Roman", serif' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <style jsx global>{`
            .blog-content {
              line-height: 1.6;
            }

            /* Set default black color but allow inline styles to override */
            .blog-content {
              color: #000000;
            }

            /* Only force black on elements WITHOUT inline color styles */
            .blog-content p:not([style*="color"]),
            .blog-content span:not([style*="color"]):not(strong):not(b) {
              color: #000000 !important;
            }

            /* Nested elements without color should be black */
            .blog-content p *:not([style*="color"]):not(strong):not(b):not(a):not(h1):not(h2):not(h3) {
              color: #000000 !important;
            }

            /* Headings - proper sizing and preserve inline styles */
            .blog-content h1,
            .blog-content h1 *,
            .blog-content h1 span {
              font-size: 2.25rem !important;
              font-weight: 700 !important;
              line-height: 1.2 !important;
              margin-top: 3rem !important;
              margin-bottom: 1.5rem !important;
            }

            .blog-content h1:first-child {
              margin-top: 0 !important;
            }

            .blog-content h2,
            .blog-content h2 *,
            .blog-content h2 span {
              font-size: 1.875rem !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
              margin-top: 2.5rem !important;
              margin-bottom: 1rem !important;
            }

            .blog-content h3,
            .blog-content h3 *,
            .blog-content h3 span {
              font-size: 1.5rem !important;
              font-weight: 700 !important;
              line-height: 1.4 !important;
              margin-top: 2rem !important;
              margin-bottom: 1rem !important;
            }

            /* Paragraph spacing */
            .blog-content p {
              margin-bottom: 1.5rem !important;
              margin-top: 0 !important;
              line-height: 1.7 !important;
            }

            /* Ensure links stay blue and underlined - must come after paragraph styles */
            .blog-content a,
            .blog-content a *,
            .blog-content p a,
            .blog-content p a * {
              color: #2563eb !important;
              text-decoration: underline !important;
            }

            .blog-content a:hover {
              color: #1d4ed8 !important;
            }

            /* List styling */
            .blog-content ul,
            .blog-content ol {
              margin-top: 1.5rem !important;
              margin-bottom: 1.5rem !important;
              padding-left: 2.5rem !important;
            }

            .blog-content li,
            .blog-content li span {
              color: #000000 !important;
              margin-bottom: 0.75rem !important;
              line-height: 1.6 !important;
            }

            /* Strong/Bold text - must be bold and inherit color from parent */
            .blog-content strong,
            .blog-content b,
            .blog-content strong *,
            .blog-content b * {
              font-weight: 700 !important;
              color: inherit !important;
            }

            /* Bold text inside paragraphs should be black */
            .blog-content p strong,
            .blog-content p b {
              color: #000000 !important;
              font-weight: 700 !important;
            }

            /* Image styling */
            .blog-content img {
              max-width: 100% !important;
              height: auto !important;
              border-radius: 0.5rem !important;
              margin: 2.5rem auto !important;
              display: block !important;
            }

            /* Blockquote */
            .blog-content blockquote {
              border-left: 4px solid #3b82f6 !important;
              padding-left: 1.5rem !important;
              margin: 2rem 0 !important;
              font-style: italic !important;
            }
          `}</style>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tag-uri:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      {relatedPosts.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Articole Similare</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                  {relatedPost.featuredImage && (
                    <Link href={`/blog/${relatedPost.slug}`} className="block relative h-48">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </Link>
                  )}
                  <div className="p-6">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <time className="text-sm text-gray-500">
                      {new Date(relatedPost.timestamp).toLocaleDateString('ro-RO')}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Înapoi la Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
