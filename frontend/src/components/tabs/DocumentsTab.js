import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
export const DocumentsTab = ({ documents, isLoading, onUpload, onDelete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 50 * 1024 * 1024) {
            setUploadError('File quá lớn (tối đa 50MB)');
            return;
        }
        setIsUploading(true);
        setUploadError(null);
        try {
            await onUpload(file);
            e.target.value = '';
        }
        catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Lỗi khi tải lên tệp');
        }
        finally {
            setIsUploading(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa tệp này?')) {
            try {
                await onDelete(id);
            }
            catch (err) {
                console.error('Failed to delete document:', err);
            }
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-32", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    const isImage = (mime) => mime?.startsWith('image/');
    return (_jsxs("div", { children: [_jsx("div", { className: "mb-6", children: _jsxs("label", { className: "flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer w-fit", children: [_jsx(Plus, { size: 18 }), isUploading ? 'Đang tải...' : 'Tải lên', _jsx("input", { type: "file", onChange: handleFileChange, disabled: isUploading, className: "hidden", accept: "image/*,.pdf,.doc,.docx" })] }) }), uploadError && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-4", children: uploadError })), documents.length === 0 ? (_jsxs("div", { className: "bg-gray-50 p-12 rounded text-center", children: [_jsx(FileText, { size: 48, className: "mx-auto text-gray-300 mb-4" }), _jsx("p", { className: "text-gray-500", children: "Ch\u01B0a c\u00F3 t\u00E0i li\u1EC7u n\u00E0o" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: documents.map((doc) => (_jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition", children: [isImage(doc.mime_type || '') ? (_jsx("img", { src: doc.file_url, alt: doc.file_name, className: "w-full h-48 object-cover" })) : (_jsx("div", { className: "w-full h-48 bg-gray-100 flex items-center justify-center", children: _jsx(FileText, { size: 48, className: "text-gray-400" }) })), _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: doc.file_name }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [doc.type === 'image' && 'Hình ảnh', doc.type === 'contract' && 'Hợp đồng', doc.type === 'document' && 'Tài liệu', doc.file_size && ` • ${(doc.file_size / 1024 / 1024).toFixed(2)}MB`] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("a", { href: doc.file_url, target: "_blank", rel: "noopener noreferrer", className: "flex-1 text-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition", children: "Xem" }), _jsx("button", { onClick: () => handleDelete(doc.id), className: "p-1 text-red-600 hover:bg-red-50 rounded transition", children: _jsx(Trash2, { size: 16 }) })] })] })] }, doc.id))) }))] }));
};
