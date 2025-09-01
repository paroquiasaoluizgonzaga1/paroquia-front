'use client';

import type { ButtonProps, RecipeProps } from '@chakra-ui/react';
import {
    Button,
    FileUpload as ChakraFileUpload,
    HStack,
    Icon,
    IconButton,
    Span,
    Text,
    useFileUploadContext,
    useRecipe,
} from '@chakra-ui/react';
import * as React from 'react';
import { LuUpload, LuX } from 'react-icons/lu';

export interface FileUploadRootProps extends ChakraFileUpload.RootProps {
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FileUploadRoot = React.forwardRef<HTMLInputElement, FileUploadRootProps>(
    function FileUploadRoot(props, ref) {
        const { children, inputProps, ...rest } = props;
        return (
            <ChakraFileUpload.Root {...rest}>
                <ChakraFileUpload.HiddenInput ref={ref} {...inputProps} />
                {children}
            </ChakraFileUpload.Root>
        );
    }
);

export interface FileUploadDropzoneProps extends ChakraFileUpload.DropzoneProps {
    label: React.ReactNode;
    description?: React.ReactNode;
}

export const FileUploadDropzone = React.forwardRef<HTMLInputElement, FileUploadDropzoneProps>(
    function FileUploadDropzone(props, ref) {
        const { children, label, description, ...rest } = props;
        return (
            <ChakraFileUpload.Dropzone ref={ref} {...rest}>
                <Icon fontSize="xl" color="fg.muted">
                    <LuUpload />
                </Icon>
                <ChakraFileUpload.DropzoneContent>
                    <div>{label}</div>
                    {description && <Text color="fg.muted">{description}</Text>}
                </ChakraFileUpload.DropzoneContent>
                {children}
            </ChakraFileUpload.Dropzone>
        );
    }
);

interface VisibilityProps {
    showSize?: boolean;
    clearable?: boolean;
}

interface FileUploadItemProps extends VisibilityProps {
    file: File;
    onClear: (file: File) => void;
}

const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(function FileUploadItem(props, ref) {
    const { file, clearable, onClear } = props;
    return (
        <ChakraFileUpload.Item file={file} ref={ref} p="2" w="full" display={'flex'} justifyContent={'space-between'}>
            <HStack>
                <ChakraFileUpload.ItemPreviewImage maxH={20} aspectRatio={'auto'} />
                <ChakraFileUpload.ItemName />
            </HStack>

            {clearable && (
                <ChakraFileUpload.ItemDeleteTrigger asChild>
                    <IconButton variant="ghost" color="fg.muted" size="xs" onClick={() => onClear(file)}>
                        <LuX />
                    </IconButton>
                </ChakraFileUpload.ItemDeleteTrigger>
            )}
        </ChakraFileUpload.Item>
    );
});

interface FileUploadListProps extends VisibilityProps, ChakraFileUpload.ItemGroupProps {
    files?: File[];
    onClear: (file: File) => void;
}

export const FileUploadList = React.forwardRef<HTMLUListElement, FileUploadListProps>(
    function FileUploadList(props, ref) {
        const { clearable, files, onClear, ...rest } = props;

        const fileUpload = useFileUploadContext();
        const acceptedFiles = files ?? fileUpload.acceptedFiles;

        if (acceptedFiles.length === 0) return null;

        return (
            <ChakraFileUpload.ItemGroup ref={ref} {...rest}>
                {acceptedFiles.map((file) => (
                    <FileUploadItem key={file.name} file={file} clearable={clearable} onClear={onClear} />
                ))}
            </ChakraFileUpload.ItemGroup>
        );
    }
);

type Assign<T, U> = Omit<T, keyof U> & U;

interface FileInputProps extends Assign<ButtonProps, RecipeProps<'input'>> {
    placeholder?: React.ReactNode;
}

export const FileInput = React.forwardRef<HTMLButtonElement, FileInputProps>(function FileInput(props, ref) {
    const inputRecipe = useRecipe({ key: 'input' });
    const [recipeProps, restProps] = inputRecipe.splitVariantProps(props);
    const { placeholder = 'Selecione os arquivos', ...rest } = restProps;
    return (
        <ChakraFileUpload.Trigger asChild>
            <Button unstyled py="0" ref={ref} {...rest} css={[inputRecipe(recipeProps), props.css]}>
                <ChakraFileUpload.Context>
                    {({ acceptedFiles }) => {
                        if (acceptedFiles.length === 1) {
                            return <span>{acceptedFiles[0].name}</span>;
                        }
                        if (acceptedFiles.length > 1) {
                            return <span>{acceptedFiles.length} files</span>;
                        }
                        return <Span color="fg.subtle">{placeholder}</Span>;
                    }}
                </ChakraFileUpload.Context>
            </Button>
        </ChakraFileUpload.Trigger>
    );
});

export const FileUploadLabel = ChakraFileUpload.Label;
export const FileUploadClearTrigger = ChakraFileUpload.ClearTrigger;
export const FileUploadTrigger = ChakraFileUpload.Trigger;
