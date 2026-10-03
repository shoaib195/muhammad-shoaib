"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AdminButton } from "./AdminButton";
import styles from "./admin.module.css";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
};

export function ImageUpload({ label, value, onChange, folder = "general", hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={styles.uploadBlock}>
      <div className={styles.uploadHead}>
        <p className={styles.uploadLabel}>{label}</p>
        {hint ? <p className={styles.muted}>{hint}</p> : null}
      </div>
      <div className={styles.uploadRow}>
        <div className={styles.uploadPreview}>
          {value ? (
            <Image src={value} alt="" fill sizes="160px" className={styles.uploadImg} unoptimized />
          ) : (
            <span className={styles.uploadEmpty}>No image</span>
          )}
        </div>
        <div className={styles.uploadActions}>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className={styles.fileInput}
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
          <AdminButton loading={uploading} onClick={() => inputRef.current?.click()}>
            Upload
          </AdminButton>
          {value ? (
            <AdminButton variant="ghost" onClick={() => onChange("")}>
              Clear
            </AdminButton>
          ) : null}
          <input
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/media/... or https://....blob.vercel-storage.com/..."
          />
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      </div>
    </div>
  );
}

type MultiProps = {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  hint?: string;
};

export function MultiImageUpload({
  label,
  values,
  onChange,
  folder = "projects",
  hint = "Upload one or more images",
}: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setError(data.error || "Upload failed");
          continue;
        }
        uploaded.push(data.url);
      }
      if (uploaded.length) onChange([...values, ...uploaded]);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={styles.uploadBlock}>
      <div className={styles.uploadHead}>
        <p className={styles.uploadLabel}>{label}</p>
        {hint ? <p className={styles.muted}>{hint}</p> : null}
      </div>
      <div className={styles.sliderGrid}>
        {values.map((url, i) => (
          <div key={`${url}-${i}`} className={styles.sliderItem}>
            <Image src={url} alt="" fill sizes="120px" className={styles.uploadImg} unoptimized />
            <button
              type="button"
              className={styles.sliderRemove}
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className={styles.sliderAdd} onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <span className={styles.spinner} /> : <span>+ Upload</span>}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className={styles.fileInput}
        onChange={(e) => onFiles(e.target.files)}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
