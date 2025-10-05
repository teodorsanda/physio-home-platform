"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PatientDocument } from "@/lib/types";
import { uploadDocument } from "@/lib/services/documents";

interface DocumentsSectionProps {
  documents: PatientDocument[];
}

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await uploadDocument();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Documents</h2>
          <p className="text-sm text-slate-500">Secure storage with virus scanning and OCR for quick verification.</p>
        </div>
        <Button onClick={handleUpload} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </header>
      <ul className="space-y-3 text-sm text-slate-500">
        {documents.length === 0 && <li className="text-slate-400">No documents uploaded.</li>}
        {documents.map((doc) => (
          <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3">
            <span className="font-medium text-slate-900">{doc.type}</span>
            <span className="text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
            <a
              href={doc.secureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
