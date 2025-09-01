import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Field } from '../ui/field';
import { HStack, IconButton, Box } from '@chakra-ui/react';
import {
    LuBold,
    LuItalic,
    LuStrikethrough,
    LuList,
    LuListOrdered,
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuHeading4,
    LuQuote,
    LuLink,
    LuUndo,
    LuRedo,
    LuHeading5,
} from 'react-icons/lu';
import { forwardRef, type ForwardRefRenderFunction } from 'react';

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    label?: React.ReactNode;
    helperText?: React.ReactNode;
    errorText?: React.ReactNode;
    optionalText?: React.ReactNode;
    isRequired?: boolean;
    isCard?: boolean;
    placeholder?: string;
    minEditorHeight?: string;
    maxEditorHeight?: string;
}

const RichTextEditorBase: ForwardRefRenderFunction<HTMLDivElement, RichTextEditorProps> = (
    {
        value = '',
        onChange,
        label,
        helperText,
        errorText,
        optionalText,
        isRequired = false,
        isCard = true,
        placeholder = 'Digite seu conteúdo aqui...',
        minEditorHeight = '300px',
        maxEditorHeight = '600px',
        ...rest
    },
    ref
) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const url = window.prompt('URL do link:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <Field
            invalid={!!errorText}
            label={label}
            helperText={helperText}
            errorText={errorText}
            optionalText={optionalText}
            required={isRequired}
        >
            <Box
                ref={ref}
                borderWidth="1px"
                borderRadius="md"
                w="full"
                borderColor={errorText ? 'red.500' : 'gray.300'}
                _dark={{
                    borderColor: errorText ? 'red.500' : 'gray.600',
                }}
                overflow="hidden"
                bg={isCard ? 'transparent' : { base: 'white', _dark: 'transparent' }}
                {...rest}
            >
                {/* Toolbar */}
                <Box
                    borderBottomWidth="1px"
                    borderBottomColor="gray.200"
                    p={2}
                    bg="gray.50"
                    _dark={{
                        borderBottomColor: 'gray.700',
                        bg: 'gray.800',
                    }}
                >
                    <HStack gap={1} flexWrap="wrap">
                        <IconButton
                            size="sm"
                            variant={editor.isActive('bold') ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('bold') ? 'brand' : 'gray'}
                            aria-label="Negrito"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                        >
                            <LuBold size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('italic') ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('italic') ? 'brand' : 'gray'}
                            aria-label="Itálico"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                        >
                            <LuItalic size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('strike') ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('strike') ? 'brand' : 'gray'}
                            aria-label="Riscado"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                        >
                            <LuStrikethrough size={16} />
                        </IconButton>

                        <Box w="1px" h="24px" bg="gray.300" _dark={{ bg: 'gray.600' }} />

                        <IconButton
                            size="sm"
                            variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('heading', { level: 1 }) ? 'brand' : 'gray'}
                            aria-label="Título 1"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                            <LuHeading1 size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('heading', { level: 2 }) ? 'brand' : 'gray'}
                            aria-label="Título 2"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            <LuHeading2 size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('heading', { level: 3 }) ? 'brand' : 'gray'}
                            aria-label="Título 3"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                            <LuHeading3 size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('heading', { level: 4 }) ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('heading', { level: 4 }) ? 'brand' : 'gray'}
                            aria-label="Título 4"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                        >
                            <LuHeading4 size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('heading', { level: 5 }) ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('heading', { level: 5 }) ? 'brand' : 'gray'}
                            aria-label="Título 5"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                        >
                            <LuHeading5 size={16} />
                        </IconButton>

                        <Box w="1px" h="24px" bg="gray.300" _dark={{ bg: 'gray.600' }} />

                        <IconButton
                            size="sm"
                            variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('bulletList') ? 'brand' : 'gray'}
                            aria-label="Lista com marcadores"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            <LuList size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('orderedList') ? 'brand' : 'gray'}
                            aria-label="Lista numerada"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            <LuListOrdered size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant={editor.isActive('blockquote') ? 'solid' : 'ghost'}
                            colorScheme={editor.isActive('blockquote') ? 'brand' : 'gray'}
                            aria-label="Citação"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        >
                            <LuQuote size={16} />
                        </IconButton>

                        <Box w="1px" h="24px" bg="gray.300" _dark={{ bg: 'gray.600' }} />

                        <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            aria-label="Adicionar link"
                            onClick={setLink}
                        >
                            <LuLink size={16} />
                        </IconButton>
                        <Box w="1px" h="24px" bg="gray.300" _dark={{ bg: 'gray.600' }} />

                        <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            aria-label="Desfazer"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                        >
                            <LuUndo size={16} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            aria-label="Refazer"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                        >
                            <LuRedo size={16} />
                        </IconButton>
                    </HStack>
                </Box>

                <Box
                    p={4}
                    minH={minEditorHeight}
                    maxH={maxEditorHeight}
                    overflowY="auto"
                    position="relative"
                    _focusWithin={{
                        outline: 'none',
                        ring: '2px',
                        ringColor: 'brand.500',
                        ringOffset: '2px',
                    }}
                >
                    <EditorContent
                        editor={editor}
                        style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                        }}
                    />
                </Box>
            </Box>
        </Field>
    );
};

export const RichTextEditor = forwardRef(RichTextEditorBase);
