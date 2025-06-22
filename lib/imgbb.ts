interface ImgBBResponse {
  data: {
    id: string;
    url: string;
    display_url: string;
    title: string;
    time: string; // ISO 8601 timestamp
    size: number;
    width: number;
    height: number;
    delete_url?: string;
  };
  success: boolean;
  status: number;
}

export interface Img {
  id: string;
  url: string;
  displayUrl: string;
  title: string;
  timestamp: string; // ISO 8601 with milliseconds
  size: number;
  width: number;
  height: number;
}

// API configuration - replace with your actual API key and endpoint
const API_KEY = process.env.IMGBB_API_KEY;
const API_BASE_URL = 'https://api.imgbb.com/1';

// Custom error class for ImgBB API errors
class ImgBBError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ImgBBError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ImgBBError(
      `API request failed with status ${response.status}`,
      response.status,
      await response.json().catch(() => null)
    );
  }

  const data = await response.json();
  if (!data.success) {
    throw new ImgBBError(
      'API request was not successful',
      data.status,
      data
    );
  }

  return data;
}

// Transform API response to our Img interface
function transformImgBBResponse(response: ImgBBResponse): Img {
  return {
    id: response.data.id,
    url: response.data.url,
    displayUrl: response.data.display_url,
    title: response.data.title,
    timestamp: new Date(response.data.time).toISOString(),
    size: response.data.size,
    width: response.data.width,
    height: response.data.height,
  };
}

/**
 * Fetches all images from the user's gallery
 * @returns Promise resolving to an array of Img objects
 * @throws ImgBBError if the API request fails
 */
export async function fetchGallery(): Promise<Img[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/account/images?key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await handleResponse<{ data: ImgBBResponse[] }>(response);
    return data.data.map(item => transformImgBBResponse(item));
  } catch (error) {
    if (error instanceof ImgBBError) {
      throw error;
    }
    throw new ImgBBError(
      'Failed to fetch gallery: ' + (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Uploads an image to ImgBB
 * @param file The file object to upload
 * @returns Promise resolving to the uploaded Img object
 * @throws ImgBBError if the API request fails
 */
export async function uploadImage(file: File): Promise<Img> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await handleResponse<ImgBBResponse>(response);
    return transformImgBBResponse(data);
  } catch (error) {
    if (error instanceof ImgBBError) {
      throw error;
    }
    throw new ImgBBError(
      'Failed to upload image: ' + (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Deletes an image from ImgBB
 * @param id The ID of the image to delete
 * @returns Promise that resolves when the image is deleted
 * @throws ImgBBError if the API request fails
 */
export async function deleteImage(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/images/delete/${id}?key=${API_KEY}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    await handleResponse<{ success: boolean }>(response);
  } catch (error) {
    if (error instanceof ImgBBError) {
      throw error;
    }
    throw new ImgBBError(
      'Failed to delete image: ' + (error instanceof Error ? error.message : String(error))
    );
  }
}
