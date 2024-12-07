import React, { ReactNode, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  title: string;
  album: { id: string; title: string } | null;
  onAddPhotos: (photos: File[], albumId: string) => void;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  onDeleteConfirm?: () => void; // Make onDeleteConfirm optional
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  onAddPhotos,
  album,
  children,
  footer,
  onDeleteConfirm
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setPhotoPreviews(previews);
    }
  };

  const handleUpload = async () => {
    if (album && selectedFiles.length > 0) {
      setIsUploading(true);
      await onAddPhotos(selectedFiles, album.id);
      setSelectedFiles([]);
      setPhotoPreviews([]);
      setIsUploading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <FaTimes />
          </button>
        </div>

        {title === "Add Photos" && (
          <>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {photoPreviews.length > 0 && (
              <div className="flex gap-4 mb-4">
                {photoPreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isUploading ? "Uploading..." : "Upload Photos"}
            </button>
          </>
        )}

        {title === "Delete Photo" && (
          <div className="flex justify-center items-center mb-4">
            <button
              onClick={onDeleteConfirm}
              className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm Deletion
            </button>
          </div>
        )}

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;