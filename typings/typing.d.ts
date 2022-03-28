declare module '@/single-line-log';
declare module '*.json' {
  const value: any;
  export default value;
}
interface CompressConfigType {
  dir: string;
  min: number;
  output: string;
  width: number;
  quality: number;
}
interface ISizeExtends {
  width: number;
  height: number;
  orientation?: number;
  type?: string;
}

interface CompressJpegType {
  baseName: string;
  extname: string;
  url: string;
}
