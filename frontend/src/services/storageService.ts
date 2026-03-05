import axios from 'axios';
import { apiPrivate } from '@/lib/axios';

export const storageService = {
  /**
   * Obtiene una URL prefirmada para subir archivos directamente a S3/R2/Supabase
   * @param filename Nombre original del archivo
   * @param contentType Tipo MIME del archivo (image/jpeg, etc.)
   * @param folder Carpeta destino ('avatars', 'logos', 'documents')
   */
  getPresignedUrl: async (filename: string, contentType: string, folder: 'avatars' | 'logos' | 'documents' = 'avatars') => {
    const { data } = await apiPrivate.post('/storage/presigned-url', {
      filename,
      contentType,
      folder
    });
    return data as { uploadUrl: string; key: string; url: string };
  },

  /**
   * Sube el archivo binario a la URL prefirmada mediante PUT
   * @param uploadUrl La URL recibida de getPresignedUrl
   * @param file El objeto File de JS
   */
  uploadFile: async (uploadUrl: string, file: File) => {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type
      },
      // Útil para mostrar progreso en la UI si se añade callback
      onUploadProgress: (progressEvent) => {
         const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
         console.debug(`Upload progress: ${percentCompleted}%`);
      }
    });
  }
};
