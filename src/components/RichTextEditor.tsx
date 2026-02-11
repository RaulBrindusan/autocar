'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4',
        'data-placeholder': placeholder || 'Start typing...',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors font-bold text-gray-900 ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors italic text-gray-900 ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors line-through text-gray-900 ${
            editor.isActive('strike') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          S
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insert Elements */}
        <button
          onClick={setLink}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('link') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          🔗 Link
        </button>
        <button
          onClick={addImage}
          className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900"
          type="button"
        >
          🖼 Image
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Block Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('blockquote') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          " Quote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive('codeBlock') ? 'bg-gray-300' : ''
          }`}
          type="button"
        >
          &lt;/&gt; Code
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Clear Formatting */}
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900"
          type="button"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
