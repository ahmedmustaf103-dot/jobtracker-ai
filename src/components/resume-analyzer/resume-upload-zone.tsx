"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { MAX_RESUME_BYTES } from "@/validations/resume";

type ResumeUploadZoneProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  selectedFileName?: string | null;
};

export function ResumeUploadZone({
  onFileSelect,
  disabled,
  selectedFileName,
}: ResumeUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || disabled) return;
      onFileSelect(file);
    },
    [disabled, onFileSelect],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
        dragging
          ? "border-violet-500/60 bg-violet-500/10"
          : "border-white/15 bg-white/[0.02] hover:border-violet-500/40 hover:bg-white/[0.04]",
        disabled && "pointer-events-none opacity-60",
      )}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
        {selectedFileName ? (
          <FileText className="h-7 w-7 text-violet-300" />
        ) : (
          <Upload className="h-7 w-7 text-violet-300" />
        )}
      </div>

      {selectedFileName ? (
        <>
          <p className="mt-4 text-sm font-medium text-zinc-100">
            {selectedFileName}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Click or drop to replace
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm font-medium text-zinc-100">
            Drag & drop your resume
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            PDF or DOCX · max {Math.round(MAX_RESUME_BYTES / 1024 / 1024)} MB
          </p>
        </>
      )}
    </div>
  );
}
