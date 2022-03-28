import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import globFast from 'fast-glob';
import images from 'images';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { ProgressBar } from './ProgressBar';
export class CompressImage {
  compressConfig: CompressConfigType;
  pb: ProgressBar;
  constructor(compressConfig: CompressConfigType) {
    this.compressConfig = compressConfig;
    this.pb = new ProgressBar('压缩进度', 0);
  }
  checkOutput() {
    if (!fs.existsSync(this.compressConfig.output)) {
      fs.mkdirSync(this.compressConfig.output);
      return;
    }
  }
  async getImageInfo(url: string, isWidth = true) {
    const fileInfo = fs.statSync(url);
    const size = +(fileInfo.size / 1024 / 1024).toFixed(2);
    if (isWidth) {
      const dimensions = await sizeOf(url);
      return { size, width: dimensions.width, height: dimensions.height };
    }
    return { size };
  }
  async compressJpg(params: CompressJpegType) {
    const { width = 0 } = await this.getImageInfo(params.url);
    const outPath = `${this.compressConfig.output}/${params.baseName}${params.extname}`;
    if (width > 1080) {
      images(params.url).size(1080).save(outPath, { quality: this.compressConfig.quality });
    } else {
      images(params.url).save(outPath, { quality: this.compressConfig.quality });
    }
    const { size } = await this.getImageInfo(outPath, false);
    return size;
  }
  async compressPng(url: string) {
    const files = await imagemin([url], {
      destination: this.compressConfig.output,
      plugins: [
        imageminPngquant({
          quality: [0.3, 0.8], //压缩质量（0,1）
        }),
      ],
    });
    const data = files[0];
    const { size } = await this.getImageInfo(data.destinationPath, false);
    return size;
  }

  start() {
    //   先检查下目录
    this.checkOutput();
    // 匹配当目录文件
    const files = globFast.sync([`${this.compressConfig.dir}/*.png`, `${this.compressConfig.dir}/*.jpg`, `${this.compressConfig.dir}/*.jpeg`], { dot: true });
    // 记录下当前压缩进度
    let compressionNumber = 0;
    files.map(async (item, i) => {
      const extname = path.extname(item);
      const reg = new RegExp(extname, 'ig');
      const baseName = path.basename(item).replace(reg, '');
      const { size } = await this.getImageInfo(item);
      let compressSize = 0;
      compressionNumber++;
      // 小于文件大小不压缩
      if (+size > this.compressConfig.min) {
        if (['.jpg', '.jpeg'].includes(extname)) {
          const res = await this.compressJpg({ baseName, extname, url: item });
          compressSize = res;
        }
        if (['.png'].includes(extname)) {
          const res = await this.compressPng(item);
          compressSize = res;
        }
      }

      const text = `压缩完成:文件实际大小${size}Mb,压缩后文件大小${compressSize}mb,压缩率:${((1 - compressSize / size) * 100).toFixed(2)}%`;
      this.renderBar(compressionNumber, files.length, text);
    });
  }
  renderBar(number: number, total: number, text: string) {
    this.pb.render({ completed: number, total: total }, text);
  }
}
