import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2, Star, StarOff, FileText } from 'lucide-react';
import api from '@/services/api';

const isPdf = (url: string) => url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf');

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
  accept = 'image/*',
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
        // Explicitly set multipart/form-data to override default application/json header
        const res = await api.post('/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
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
        <div className="mb-2 p-2 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-400 text-xs">
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
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-[#0b1222] ${
                  isCover ? 'border-[#c9a96e] ring-2 ring-[#c9a96e]/30' : 'border-[#3d301d]'
                }`}
              >
                {isPdf(url) ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center bg-[#0b1222] text-[#f4ede0]/70 hover:bg-[#111a2e] transition gap-1 p-2"
                    title="Open PDF"
                  >
                    <FileText className="w-6 h-6 text-rose-400" />
                    <span className="text-[10px] text-center leading-tight break-all line-clamp-2">
                      {url.split('/').pop()}
                    </span>
                  </a>
                ) : (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}

                {isCover && !isPdf(url) && (
                  <div className="absolute top-1 left-1 bg-[#c9a96e] text-[#0b1222] text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> Cover
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {showCoverPicker && !isCover && !isPdf(url) && (
                    <button
                      type="button"
                      onClick={() => setCover(url)}
                      className="w-7 h-7 bg-[#0b1222]/90 hover:bg-[#0b1222] border border-[#c9a96e] rounded-full flex items-center justify-center text-[#c9a96e]"
                      title="Set as cover"
                    >
                      <StarOff className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(url)}
                    className="w-7 h-7 bg-rose-900/80 border border-rose-600 hover:bg-rose-900 rounded-full flex items-center justify-center text-rose-200"
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
        className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#3d301d] rounded-lg text-sm text-[#f4ede0]/70 hover:border-[#c9a96e] hover:text-[#c9a96e] hover:bg-[#111a2e] transition w-full justify-center"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#c9a96e]" /> Uploading…
          </>
        ) : (
          <>
            <ImagePlus className="w-4 h-4 text-[#c9a96e]" />
            {images.length === 0
              ? accept.includes('.pdf') ? 'Add files' : 'Add images'
              : 'Add more'}
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
