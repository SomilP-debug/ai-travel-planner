import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function PhotoWall({ tripId }) {
  const [photos, setPhotos] = useState([]); 
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

 
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await api.get(`/trips/${tripId}`);
        if (data.photos) setPhotos(data.photos);
      } catch (error) {
        console.error("Failed to fetch photos", error);
      }
    };
    fetchPhotos();
  }, [tripId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await api.post(`/trips/${tripId}/photos`, { photoUrl: data.url });
      
      setPhotos([...photos, data.url]);
      
    } catch (error) {
      console.error("Upload failed", error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Trip Photo Wall</h2>
          <p className="text-gray-500 text-sm">Upload and share memories with your collaborators.</p>
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleUpload} 
        />
        
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <ImageIcon size={48} className="mb-4 opacity-50" />
          <p>No photos uploaded yet. Be the first to add a memory!</p>
        </div>
      ) : (
       
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((url, index) => (
            <div key={index} className="break-inside-avoid overflow-hidden rounded-xl shadow-sm hover:shadow-md transition">
              <img 
                src={url} 
                alt={`Trip memory ${index + 1}`} 
                className="w-full h-auto object-cover transform hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}