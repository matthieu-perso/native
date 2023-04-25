import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@/components/ui/button';
const maxSize = 100 * 1024 * 1024; // 100 MB

function Uploader({ onFilesUploaded, handleAddFiles }) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': [],
    },
    maxSize,
    multiple: false,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({file, errors}) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            console.log(`File is too large. Maximum allowed size is 100 MB.`);
          } else if (error.code === 'file-invalid-type') {
            console.log(`File has an invalid type. Only PDF, DOCX, and TXT files are allowed.`);
          }
        });
      });
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(newFiles);

      // Call the onFilesUploaded callback with the uploaded files
      onFilesUploaded(newFiles);

      handleAddFiles(newFiles);

    },
  });

  const thumbs = files.map((file: any) => (
    <div key={file.name} className="h-full w-full">
      <img
        src={file.preview}
        className="mx-auto max-h-full max-w-full object-contain"
        alt="Document Upload"
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  console.log("Files in uploader", files);

  return (
    <div className="rounded-lg border border-solid border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-light-dark sm:p-6">
      <div
        {...getRootProps({
          className:
            'border border-dashed relative border-gray-200 dark:border-gray-700 h-48 flex items-center justify-center rounded-lg',
        })}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          thumbs
        ) : (
          <div className="text-center">
            <p className="mb-6 text-sm tracking-tighter text-gray-600 dark:text-gray-400">
              PDF, DOCX, TXT. Max 100mb. More formats coming soon.
            </p>
            <Button>CHOOSE FILE</Button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Uploader;
