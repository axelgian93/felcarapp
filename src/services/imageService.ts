
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const ImageService = {
  takePhoto: async (): Promise<string | undefined> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Base64 for immediate preview/upload
        source: CameraSource.Prompt // Ask user: Camera or Photos
      });

      return image.dataUrl;
    } catch (error) {
      console.error('Error taking photo:', error);
      return undefined;
    }
  }
};
