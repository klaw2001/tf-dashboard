'use client'

// React Imports
import { useEditor, EditorContent } from '@tiptap/react'

// Tiptap Extensions
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { TextAlign } from '@tiptap/extension-text-align'
import { ListItem } from '@tiptap/extension-list-item'
import { BulletList } from '@tiptap/extension-bullet-list'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { Link } from '@tiptap/extension-link'

// MUI Imports
import {
    Box,
    Paper,
    IconButton,
    Divider,
    Button,
    ButtonGroup,
    Menu,
    MenuItem,
    Tooltip,
    Select,
    FormControl,
    InputLabel
} from '@mui/material'

// Icon Imports
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatStrikethrough,
    FormatListBulleted,
    FormatListNumbered,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    Link as LinkIcon,
    LinkOff,
    Code,
    FormatQuote,
    Undo,
    Redo
} from '@mui/icons-material'

const RichTextEditor = ({
    value = '',
    onChange,
    placeholder = 'Start typing...',
    minHeight = 200,
    maxHeight = 400,
    disabled = false
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            TextStyle,
            Color.configure({
                types: [TextStyle.name],
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            ListItem,
            BulletList.configure({
                HTMLAttributes: {
                    class: 'tiptap-bullet-list',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'tiptap-ordered-list',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'tiptap-link',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
        },
        editable: !disabled,
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const ToolbarButton = ({ onClick, isActive, children, title, disabled = false }) => (
        <Tooltip title={title}>
            <IconButton
                onClick={onClick}
                size="small"
                color={isActive ? 'primary' : 'default'}
                disabled={disabled}
                sx={{
                    borderRadius: 1,
                    '&.MuiIconButton-root': {
                        color: isActive ? 'primary.main' : 'text.secondary',
                        backgroundColor: isActive ? 'action.selected' : 'transparent',
                        '&:hover': {
                            backgroundColor: isActive ? 'action.selected' : 'action.hover',
                        },
                    },
                }}
            >
                {children}
            </IconButton>
        </Tooltip>
    )

    return (
        <Paper
            elevation={1}
            sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                    borderColor: 'primary.main',
                },
                '&:focus-within': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                }
            }}
        >
            {/* Toolbar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 1,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 'grey.50',
                    flexWrap: 'wrap',
                }}
            >
                {/* Text Formatting */}
                <ButtonGroup size="small" variant="text">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <FormatBold fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <FormatItalic fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <FormatStrikethrough fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Code"
                    >
                        <Code fontSize="small" />
                    </ToolbarButton>
                </ButtonGroup>

                <Divider orientation="vertical" flexItem />

                {/* Lists */}
                <ButtonGroup size="small" variant="text">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <FormatListBulleted fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <FormatListNumbered fontSize="small" />
                    </ToolbarButton>
                </ButtonGroup>

                <Divider orientation="vertical" flexItem />

                {/* Alignment */}
                <ButtonGroup size="small" variant="text">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <FormatAlignLeft fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <FormatAlignCenter fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <FormatAlignRight fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justify"
                    >
                        <FormatAlignJustify fontSize="small" />
                    </ToolbarButton>
                </ButtonGroup>

                <Divider orientation="vertical" flexItem />

                {/* Link */}
                <ToolbarButton
                    onClick={addLink}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                >
                    <LinkIcon fontSize="small" />
                </ToolbarButton>

                <Divider orientation="vertical" flexItem />

                {/* Undo/Redo */}
                <ButtonGroup size="small" variant="text">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo fontSize="small" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo fontSize="small" />
                    </ToolbarButton>
                </ButtonGroup>
            </Box>

            {/* Editor Content */}
            <Box
                sx={{
                    minHeight: minHeight,
                    maxHeight: maxHeight,
                    overflow: 'auto',
                    p: 2,
                    '& .ProseMirror': {
                        outline: 'none',
                        minHeight: minHeight - 32,
                        '& p': {
                            margin: '0 0 1em 0',
                        },
                        '& ul, & ol': {
                            paddingLeft: '1.5em',
                            margin: '0 0 1em 0',
                        },
                        '& li': {
                            margin: '0.25em 0',
                        },
                        '& blockquote': {
                            borderLeft: '3px solid #e0e0e0',
                            paddingLeft: '1em',
                            margin: '1em 0',
                            fontStyle: 'italic',
                        },
                        '& code': {
                            backgroundColor: '#f5f5f5',
                            padding: '0.2em 0.4em',
                            borderRadius: '3px',
                            fontSize: '0.85em',
                        },
                        '& a': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: 'primary.dark',
                            },
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            fontWeight: 'bold',
                            margin: '1em 0 0.5em 0',
                        },
                        '& h1': { fontSize: '1.5em' },
                        '& h2': { fontSize: '1.3em' },
                        '& h3': { fontSize: '1.1em' },
                    },
                    '& .ProseMirror p.is-editor-empty:first-child::before': {
                        content: `"${placeholder}"`,
                        float: 'left',
                        color: 'text.disabled',
                        pointerEvents: 'none',
                        height: 0,
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Box>
        </Paper>
    )
}

export default RichTextEditor
