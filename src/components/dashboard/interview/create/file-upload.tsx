"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { parsePdf } from "@/actions/pdf";

interface FileUploadProps {
  isUploaded: boolean;
  setIsUploaded: (isUploaded: boolean) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  setUploadedDocumentContext: (context: string) => void;
}

export default function FileUpload(props: FileUploadProps) {
  const { isUploaded, setIsUploaded, fileName, setFileName, setUploadedDocumentContext } = props;
  const [_uploading, setUploading] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFileName(file.name);
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please upload a file smaller than 10MB.", {
          position: "bottom-right",
          duration: 3000,
        });

        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await parsePdf(formData);
        if (!result.success) {
          throw new Error(result.error);
        }
        const fullText = result.text || "";
        setUploadedDocumentContext(fullText);
        setIsUploaded(true);
      } catch (error) {
        console.log(error);
        toast.error("Error reading PDF", {
          description: "Please try again.",
          duration: 3000,
        });
      } finally {
        setUploading(false);
      }
    },
  });

  const uploadZone = (
    <div
      {...getRootProps({
        className:
          "border-dashed border-2 border-primary/40 rounded-xl cursor-pointer bg-primary/10 h-32 flex justify-center items-center flex-col gap-1",
      })}
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 text-primary" />
      <p className="mt-1 text-foreground text-sm">
        Drag &amp; drop files or{" "}
        <span className="cursor-pointer font-medium text-primary underline">Browse</span>
      </p>
      <p className="text-muted-foreground text-xs">Supported formats: PDF (Max 10.0 MB)</p>
    </div>
  );

  const uploadedView = (
    <div className="text-left">
      <p className="mt-2 text-muted-foreground text-sm">File uploaded successfully. {fileName}</p>
      <p className="mt-2 text-muted-foreground text-xs">
        Do you want to{" "}
        <button
          type="button"
          className="cursor-pointer font-semibold text-foreground underline"
          onClick={() => setIsUploaded(false)}
        >
          Reupload?
        </button>
      </p>
    </div>
  );

  return <div className="w-full">{!isUploaded ? uploadZone : uploadedView}</div>;
}
