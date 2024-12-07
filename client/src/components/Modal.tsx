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
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, onAddPhotos, album, children, footer }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false); // Add a loading state

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setPhotoPreviews(previews);
    }
  };

  // Handle photo upload
  const handleUpload = async () => {
    if (album && selectedFiles.length > 0) {
      setIsUploading(true); // Set uploading state to true

      // Simulate async photo upload (replace with real upload logic)
      await onAddPhotos(selectedFiles, album.id);
      
      // Clear the selected files and previews after upload
      setSelectedFiles([]);
      setPhotoPreviews([]);

      // Close modal after upload completes
      setIsUploading(false); // Set uploading state to false
      onClose(); // Close modal
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

        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Previews of selected photos */}
        {photoPreviews.length > 0 && (
          <div className="flex gap-4 mb-4">
            {photoPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading} // Disable if uploading
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? "Uploading..." : selectedFiles.length > 0 ? "Upload Photos" : "No Photos Selected"}
        </button>

        {/* Footer */}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
