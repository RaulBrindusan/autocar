'use client';

import { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import TiptapTextAlign from '@tiptap/extension-text-align';
import { Extension } from '@tiptap/core';
import { uploadBlogImage } from '@/lib/firebase/storage';

// Custom FontSize extension
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  postId: string;
}

export default function RichTextEditor({ content, onChange, placeholder, postId }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize,
      TiptapTextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-p:text-gray-900 prose-headings:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 text-gray-900 max-w-none focus:outline-none min-h-[900px] p-4',
        'data-placeholder': placeholder || 'Start typing...',
        style: 'font-family: "Times New Roman", serif;',
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Tip fișier invalid. Doar JPEG, PNG, GIF și WebP sunt permise.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Fișierul este prea mare. Dimensiunea maximă este 10MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const { url, error: uploadError } = await uploadBlogImage(file, postId);

      if (uploadError) {
        throw new Error(uploadError);
      }

      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.message || 'A apărut o eroare la încărcarea imaginii');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const addImage = () => {
    imageInputRef.current?.click();
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const fonts = [
    { name: 'Times New Roman (Default)', value: '' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  ];

  const fontSizes = [
    { name: 'Default', value: '' },
    { name: 'Small (12px)', value: '12px' },
    { name: 'Normal (14px)', value: '14px' },
    { name: 'Medium (16px)', value: '16px' },
    { name: 'Large (18px)', value: '18px' },
    { name: 'XL (24px)', value: '24px' },
    { name: '2XL (32px)', value: '32px' },
    { name: '3XL (48px)', value: '48px' },
  ];

  const colors = [
    '#000000', '#444444', '#666666', '#999999', '#CCCCCC', '#EEEEEE', '#FFFFFF',
    '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9900FF', '#FF00FF',
    '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#CFE2F3', '#D9D2E9', '#EAD1DC',
    '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD',
    '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6FA8DC', '#8E7CC3', '#C27BA0',
    '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79',
    '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#0B5394', '#351C75', '#741B47',
  ];

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const setFont = (fontFamily: string) => {
    if (fontFamily) {
      editor.chain().focus().setFontFamily(fontFamily).run();
    } else {
      editor.chain().focus().unsetFontFamily().run();
    }
    setShowFontPicker(false);
  };

  const setFontSize = (fontSize: string) => {
    if (fontSize) {
      editor.chain().focus().setFontSize(fontSize).run();
    } else {
      editor.chain().focus().unsetFontSize().run();
    }
    setShowFontSizePicker(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300 shadow-sm rounded-t-lg">
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

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="Align Left"
        >
          ⬅️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="Align Center"
        >
          ↔️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="Align Right"
        >
          ➡️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900 ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''
          }`}
          type="button"
          title="Justify"
        >
          ⬌
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
          disabled={uploadingImage}
        >
          {uploadingImage ? '⏳ Uploading...' : '🖼 Image'}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleImageUpload}
          className="hidden"
        />

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

        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => setShowFontPicker(!showFontPicker)}
            className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900"
            type="button"
          >
            🔤 Font
          </button>
          {showFontPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[180px] max-h-[300px] overflow-y-auto">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setFont(font.value)}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-900"
                  style={{ fontFamily: font.value || 'inherit' }}
                  type="button"
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="relative">
          <button
            onClick={() => setShowFontSizePicker(!showFontSizePicker)}
            className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900"
            type="button"
          >
            📏 Size
          </button>
          {showFontSizePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-900"
                  style={{ fontSize: size.value || 'inherit' }}
                  type="button"
                >
                  {size.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-3 py-1 rounded hover:bg-gray-200 transition-colors text-gray-900"
            type="button"
          >
            🎨 Color
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setTextColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    type="button"
                    title={color}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="w-full px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-900"
                type="button"
              >
                Reset Color
              </button>
            </div>
          )}
        </div>

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
