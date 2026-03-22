import { Button, Label } from '@heroui/react'
import { useState } from 'react'
import { DropZone, FileTrigger } from 'react-aria-components'
import { IconClose, IconUpload } from '@/icons'

const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
]

interface FileInputProps {
    label: string
    accept?: string[]
    onChange: (file: File | null) => void
    existingFile?: boolean
    error?: string
}

export default function FileInput({
    label,
    accept = ACCEPTED_FILE_TYPES,
    onChange,
    existingFile = false,
    error,
}: FileInputProps) {
    const [file, setFile] = useState<File | null>(null)

    const handleSelect = (files: FileList | null) => {
        const selected = files?.item(0) ?? null
        setFile(selected)
        onChange(selected)
    }

    const handleDrop = async (e: { items: Iterable<unknown> }) => {
        for (const item of e.items) {
            if (typeof item === 'object' && item !== null && 'kind' in item && item.kind === 'file') {
                const droppedFile = await (item as { getFile: () => Promise<File> }).getFile()
                if (accept.includes(droppedFile.type)) {
                    setFile(droppedFile)
                    onChange(droppedFile)
                    return
                }
            }
        }
    }

    const handleRemove = () => {
        setFile(null)
        onChange(null)
    }

    return (
        <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium">{label}</Label>
            {file ? (
                <div className="border-divider flex items-center gap-3 rounded-lg border px-3 py-2">
                    <IconUpload className="text-default-500 size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        onPress={handleRemove}
                        aria-label="Datei entfernen"
                        className="text-default-500 hover:text-danger shrink-0"
                    >
                        <IconClose className="size-4" />
                    </Button>
                </div>
            ) : (
                <DropZone
                    onDrop={handleDrop}
                    className="border-border data-[drop-target]:border-focus data-[drop-target]:bg-focus/5 flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-5 transition-colors"
                >
                    <IconUpload className="text-default-400 size-6" />
                    <p className="text-default-500 text-sm">
                        Datei hierher ziehen oder{' '}
                        <FileTrigger
                            acceptedFileTypes={accept}
                            onSelect={handleSelect}
                        >
                            <button
                                type="button"
                                className="text-focus hover:underline font-medium"
                            >
                                auswählen
                            </button>
                        </FileTrigger>
                    </p>
                    {existingFile && (
                        <p className="text-default-400 text-xs">
                            Aktuelle Datei vorhanden
                        </p>
                    )}
                </DropZone>
            )}
            {error && (
                <p className="text-sm text-danger">{error}</p>
            )}
        </div>
    )
}
