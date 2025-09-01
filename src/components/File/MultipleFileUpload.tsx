import { type FileUploadFileAcceptDetails, type FileUploadFileRejectDetails } from '@chakra-ui/react';
import { toaster } from '../ui/toaster';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '../ui/file-upload';
import { Field } from '../ui/field';

interface MultipleFileUploadProps {
    onUpload: (files: File[]) => void;
    onClear: (file: File) => void;
    errorText?: string;
    label?: string;
}

export function MultipleFileUpload({
    onUpload,
    onClear,
    errorText = undefined,
    label = undefined,
}: MultipleFileUploadProps) {
    const handleFileRejection = (details: FileUploadFileRejectDetails) => {
        details.files.forEach((file) => {
            if (!file?.errors) {
                return;
            }

            if (file.errors.find((x) => x == 'FILE_INVALID')) {
                toaster.error({ title: `${file.file.name} - Arquivo inválido` });
                return;
            }

            if (file.errors.find((x) => x == 'FILE_INVALID_TYPE')) {
                toaster.error({
                    title: `${file.file.name} - Tipo de arquivo inválido`,
                });
                return;
            }

            if (file.errors.find((x) => x == 'FILE_TOO_LARGE')) {
                toaster.error({
                    title: `${file.file.name} - O arquivo deve ter no máximo 100 MB`,
                });
                return;
            }

            if (file.errors.find((x) => x == 'TOO_MANY_FILES')) {
                toaster.error({
                    title: `${file.file.name} - Você deve fazer o upload de apenas um arquivo`,
                });
                return;
            }

            toaster.error({ title: `${file.file.name} - Arquivo inválido` });
        });
    };

    const handleFileAccepted = (details: FileUploadFileAcceptDetails) => {
        onUpload(details.files);
    };

    return (
        <Field label={label ?? 'Arquivos'} errorText={errorText}>
            <FileUploadRoot
                alignItems="stretch"
                maxFiles={5}
                maxFileSize={20 * 1048576}
                onFileReject={handleFileRejection}
                onFileAccept={handleFileAccepted}
                accept={{
                    'image/*': ['.png', '.jpg', '.jpeg'],
                }}
            >
                <FileUploadDropzone
                    minH={'150px'}
                    label="Selecione ou arraste os arquivos aqui"
                    description="Máximo de 5 arquivos, cada um com até 20 MB"
                />
                <FileUploadList clearable onClear={onClear} />
            </FileUploadRoot>
        </Field>
    );
}
