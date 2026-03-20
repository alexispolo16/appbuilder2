import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import './RichTextEditor.css';

function MenuBar({ editor }) {
    if (!editor) return null;

    const btnClass = (active) =>
        `rte-btn${active ? ' rte-btn--active' : ''}`;

    return (
        <div className="rte-toolbar">
            <button type="button" className={btnClass(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita">
                <b>B</b>
            </button>
            <button type="button" className={btnClass(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva">
                <i>I</i>
            </button>
            <button type="button" className={btnClass(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Tachado">
                <s>S</s>
            </button>
            <span className="rte-separator" />
            <button type="button" className={btnClass(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Titulo">
                H2
            </button>
            <button type="button" className={btnClass(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Subtitulo">
                H3
            </button>
            <span className="rte-separator" />
            <button type="button" className={btnClass(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">
                &bull;
            </button>
            <button type="button" className={btnClass(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">
                1.
            </button>
            <span className="rte-separator" />
            <button
                type="button"
                className={btnClass(editor.isActive('link'))}
                onClick={() => {
                    if (editor.isActive('link')) {
                        editor.chain().focus().unsetLink().run();
                        return;
                    }
                    const url = window.prompt('URL del enlace:');
                    if (url) {
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }
                }}
                title="Enlace"
            >
                🔗
            </button>
            <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linea horizontal">
                ―
            </button>
        </div>
    );
}

export default function RichTextEditor({ value, onChange, placeholder = 'Escribe aqui...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html === '<p></p>' ? '' : html);
        },
    });

    return (
        <div className="rte-wrapper">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="rte-content" />
        </div>
    );
}
