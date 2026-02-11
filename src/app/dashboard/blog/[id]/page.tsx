'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { onBlogPostsSnapshot, addBlogPost, updateBlogPost } from '@/lib/firebase/firestore';
import { BlogPost } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import ImageUploader from '@/components/ImageUploader';
import RichTextEditor from '@/components/RichTextEditor';

export default function BlogPostFormPage() {
  return (
    <ProtectedRoute>
      <BlogPostFormContent />
    </ProtectedRoute>
  );
}

function BlogPostFormContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const isNew = params.id === 'new';

  // Generate a temporary ID for new posts to use for image uploads
  const [actualPostId, setActualPostId] = useState<string>(() => {
    if (isNew) {
      // Generate a unique ID for new posts
      return `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    return params.id as string;
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Basic fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);

  // SEO fields
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [keywords, setKeywords] = useState('');

  // Featured Image
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [featuredImageWidth, setFeaturedImageWidth] = useState('1200');
  const [featuredImageHeight, setFeaturedImageHeight] = useState('630');

  // Open Graph
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');

  // Categories and Tags
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  // Load existing post if editing
  useEffect(() => {
    if (!isNew) {
      const unsubscribe = onBlogPostsSnapshot((posts) => {
        const post = posts.find((p) => p.id === params.id);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setPublished(post.published);
          setSlug(post.slug || '');
          setMetaTitle(post.metaTitle || '');
          setMetaDescription(post.metaDescription || '');
          setExcerpt(post.excerpt || '');
          setKeywords(post.keywords?.join(', ') || '');
          setFeaturedImage(post.featuredImage || '');
          setFeaturedImageAlt(post.featuredImageAlt || '');
          setFeaturedImageWidth(post.featuredImageWidth?.toString() || '1200');
          setFeaturedImageHeight(post.featuredImageHeight?.toString() || '630');
          setOgTitle(post.ogTitle || '');
          setOgDescription(post.ogDescription || '');
          setOgImage(post.ogImage || '');
          setCategory(post.category || '');
          setTags(post.tags?.join(', ') || '');
          setLoading(false);
        }
      });
      return () => unsubscribe();
    }
  }, [isNew, params.id]);

  // Auto-generate slug from title (preserves Romanian diacritics)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s\-ăâîșțĂÂÎȘȚ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || isNew) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const postData = {
        title,
        content,
        published,
        slug: slug || generateSlug(title),
        author: user?.email || '',
        timestamp: Date.now(),

        // SEO fields (only include if not empty)
        ...(metaTitle && { metaTitle }),
        ...(metaDescription && { metaDescription }),
        ...(excerpt && { excerpt }),
        ...(keywords && { keywords: keywords.split(',').map(k => k.trim()).filter(k => k) }),

        // Featured Image
        ...(featuredImage && {
          featuredImage,
          featuredImageWidth: 1200,
          featuredImageHeight: 630,
        }),
        ...(featuredImageAlt && { featuredImageAlt }),

        // Open Graph
        ...(ogTitle && { ogTitle }),
        ...(ogDescription && { ogDescription }),
        ...(ogImage && { ogImage }),

        // Category and Tags
        ...(category && { category }),
        ...(tags && { tags: tags.split(',').map(t => t.trim()).filter(t => t) }),

        // Date modified for edits
        ...(!isNew && { dateModified: Date.now() }),
      };

      if (isNew) {
        // Use the actualPostId for new posts (to match uploaded images)
        await addBlogPost(postData, actualPostId);
      } else {
        await updateBlogPost(params.id as string, postData);
      }

      router.push('/dashboard/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('A apărut o eroare la salvarea postării');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Se încarcă...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 md:mt-0">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Featured Image Section - Moved to Top */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagine Principală</h2>

          <div className="space-y-4">
            {/* Image Uploader */}
            <ImageUploader
              postId={actualPostId}
              currentImageUrl={featuredImage}
              onImageUploaded={(url) => setFeaturedImage(url)}
              label="Imagine Principală (1200x630 recomandat pentru social media)"
              aspectRatio="16:9"
            />

            {/* Image Alt Text */}
            <div>
              <label htmlFor="featuredImageAlt" className="block text-sm font-medium text-gray-700 mb-1">
                Text Alternativ (Alt)
              </label>
              <input
                type="text"
                id="featuredImageAlt"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                placeholder="Descriere imagine pentru accesibilitate"
              />
              <p className="text-xs text-gray-500 mt-1">
                Descrie conținutul imaginii pentru utilizatorii cu deficiențe de vedere și pentru SEO (ex: "Mașină Volkswagen Golf 8 neagră în showroom")
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informații de Bază</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titlu *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                required
                placeholder="Introduceți titlul postării"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                required
                placeholder="url-friendly-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /blog/{slug || 'url-friendly-slug'}
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Conținut *
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Introduceți conținutul complet al postării"
                postId={actualPostId}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Extras (Preview)
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] placeholder:text-gray-400 text-gray-900"
                placeholder="Scurtă descriere pentru preview (opțional)"
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                  placeholder="ex: Știri Auto"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag-uri
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            {/* Published Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publică imediat
              </label>
            </div>
          </div>
        </div>

        {/* SEO Meta Tags Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Meta Tags</h2>

          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                placeholder="Titlu optimizat SEO (50-60 caractere)"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 caractere</p>
            </div>

            {/* Meta Description */}
            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] placeholder:text-gray-400 text-gray-900"
                placeholder="Descriere optimizată SEO (150-160 caractere)"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 caractere</p>
            </div>

            {/* Keywords */}
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                Keywords SEO
              </label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        {/* Open Graph Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Open Graph (Facebook & Social Media)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Controlează cum arată linkurile când sunt partajate pe Facebook, WhatsApp, Discord, Telegram, etc.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                OG Title
              </label>
              <input
                type="text"
                id="ogTitle"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
                placeholder="Titlu pentru social media (lasă gol pentru a folosi titlul)"
              />
            </div>

            <div>
              <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
                OG Description
              </label>
              <textarea
                id="ogDescription"
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] placeholder:text-gray-400 text-gray-900"
                placeholder="Descriere pentru social media"
              />
            </div>

            <div>
              <ImageUploader
                postId={actualPostId}
                currentImageUrl={ogImage}
                onImageUploaded={(url) => setOgImage(url)}
                label="OG Image (lasă gol pentru a folosi imaginea principală)"
                aspectRatio="16:9"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {saving ? 'Se salvează...' : isNew ? 'Adaugă Postare' : 'Actualizează Postare'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/blog')}
            className="flex-1 bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Anulează
          </button>
        </div>
      </form>
    </main>
  );
}
