import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2, Star, StarOff } from 'lucide-react';
import api from '@/services/api';

interface Props {
  images: string[];
  cover?: string;
  onChange: (next: { images: string[]; cover?: string }) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  showCoverPicker?: boolean;
}

export const ImageUploader = ({
  images,
  cover,
  onChange,
  label = 'Images',
  accept = 'image/*,.pdf',
  multiple = true,
  maxSizeMB = 8,
  showCoverPicker = true,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;

    const oversized = arr.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${maxSizeMB} MB`);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of arr) {
        const form = new FormData();
        form.append('file', file);
        // Let browser set Content-Type with boundary — don't override it
        const res = await api.post('/upload', form, {
          headers: { 'Content-Type': undefined },
        });
        uploaded.push(res.data.data.url);
      }
      const nextImages = [...images, ...uploaded];
      const nextCover = cover || uploaded[0] || nextImages[0];
      onChange({ images: nextImages, cover: nextCover });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = (url: string) => {
    const nextImages = images.filter((u) => u !== url);
    const nextCover = cover === url ? nextImages[0] : cover;
    onChange({ images: nextImages, cover: nextCover });
  };

  const setCover = (url: string) => {
    onChange({ images, cover: url });
  };

  return (
    <div>
      {label && <label className="label">{label}</label>}
      {error && (
        <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
          {images.map((url) => {
            const isCover = url === cover;
            return (
              <div
                key={url}
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                  isCover ? 'border-brand-500 ring-2 ring-brand-100' : 'border-ink-200'
                }`}
              >
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />

                {isCover && (
                  <div className="absolute top-1 left-1 bg-brand-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> Cover
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {showCoverPicker && !isCover && (
                    <button
                      type="button"
                      onClick={() => setCover(url)}
                      className="w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-amber-500"
                      title="Set as cover"
                    >
                      <StarOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(url)}
                    className="w-7 h-7 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-3 py-2 border border-dashed border-ink-300 rounded-lg text-sm text-ink-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition w-full justify-center"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <ImagePlus className="w-4 h-4" />
            {images.length === 0 ? 'Add images' : 'Add more'}
          </>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
};
