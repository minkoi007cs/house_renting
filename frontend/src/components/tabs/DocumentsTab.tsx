import { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Media } from '@/types';

interface DocumentsTabProps {
  documents: Media[];
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DocumentsTab = ({ documents, isLoading, onUpload, onDelete }: DocumentsTabProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File quá lớn (tối đa 50MB)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      await onUpload(file);
      e.target.value = '';
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Lỗi khi tải lên tệp');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tệp này?')) {
      try {
        await onDelete(id);
      } catch (err) {
        console.error('Failed to delete document:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isImage = (mime: string) => mime?.startsWith('image/');

  return (
    <div>
      <div className="mb-6">
        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer w-fit">
          <Plus size={18} />
          {isUploading ? 'Đang tải...' : 'Tải lên'}
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-4">
          {uploadError}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Chưa có tài liệu nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              {isImage(doc.mime_type || '') ? (
                <img
                  src={doc.file_url}
                  alt={doc.file_name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <FileText size={48} className="text-gray-400" />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {doc.type === 'image' && 'Hình ảnh'}
                  {doc.type === 'contract' && 'Hợp đồng'}
                  {doc.type === 'document' && 'Tài liệu'}
                  {doc.file_size && ` • ${(doc.file_size / 1024 / 1024).toFixed(2)}MB`}
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition"
                  >
                    Xem
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
