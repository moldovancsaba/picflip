export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export interface IframeConfig {
  id: string;
  name: string;
  contentUrl: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatioX: number;
  aspectRatioY: number;
  backgroundColor: string;
  backgroundImageUrl: string;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
  isPublic: boolean;
}
