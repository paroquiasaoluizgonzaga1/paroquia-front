import { FileUploadFileAcceptDetails, FileUploadFileRejectDetails } from '@chakra-ui/react';
import { toaster } from '../ui/toaster';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '../ui/file-upload';
import { Field } from '../ui/field';

interface FileUploadProps {
    onUpload: (file: File) => void;
    onClear: (file: File) => void;
    errorText?: string;
    label?: string;
}

export function FileUpload({ onUpload, onClear, errorText = undefined, label = undefined }: FileUploadProps) {
    const handleFileRejection = (details: FileUploadFileRejectDetails) => {
        if (!details.files[0]?.errors) {
            return;
        }

        if (details.files[0].errors.find((x) => x == 'FILE_INVALID')) {
            toaster.error({ title: 'Arquivo inválido' });
            return;
        }

        if (details.files[0].errors.find((x) => x == 'FILE_INVALID_TYPE')) {
            toaster.error({ title: 'Tipo de arquivo inválido' });
            return;
        }

        if (details.files[0].errors.find((x) => x == 'FILE_TOO_LARGE')) {
            toaster.error({ title: 'O arquivo deve ter no máximo 100 MB' });
            return;
        }

        if (details.files[0].errors.find((x) => x == 'TOO_MANY_FILES')) {
            toaster.error({ title: 'Você deve fazer o upload de apenas um arquivo' });
            return;
        }

        toaster.error({ title: 'Arquivo inválido' });
    };

    const handleFileAccepted = (details: FileUploadFileAcceptDetails) => {
        onUpload(details.files[0]);
    };

    return (
        <Field label={label ?? 'Arquivo'} errorText={errorText}>
            <FileUploadRoot
                alignItems="stretch"
                maxFiles={1}
                maxFileSize={100 * 1048576}
                onFileReject={handleFileRejection}
                onFileAccept={handleFileAccepted}
            >
                <FileUploadDropzone
                    minH={'150px'}
                    label="Selecione ou arraste o arquivo aqui"
                    description="máximo de 100 MB"
                />
                <FileUploadList clearable onClear={onClear} />
            </FileUploadRoot>
        </Field>
    );
}
