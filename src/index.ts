import pkg from '../package.json';
import { Command } from 'commander';
import { CompressImage } from './tool/compress';
const program = new Command();
// 当前项目路径
const currPath = process.cwd();
program.version(pkg.version, '-V --version').usage('<command> [options]');
program
  // .command('compress')
  .description('serve your project in development mode')
  .option('-d, --dir <dir>', `Your current directory (default:${currPath})`, currPath)
  .option('-m, --min <min>', 'Minimum compressed volume in MB (default:1MB)', 100)
  .option('-q, --quality <quality>', 'compression quality (default:1MB)', 70)
  .option('-w, --width <width>', 'Compress maximum width', 1080)
  .option('-o, --output <output>', 'Output directory (default: --dir/output)', `${currPath}/output`)
  .action((cmd) => {
    const { dir, min, quality, width, output } = cmd;
    // dir: cmd.dir, min: cmd.min, output: cmd.output, width: cmd.width, quality: cmd.quality
    const compress = new CompressImage({ dir, min, quality, width, output });
    compress.start();
  });
program.parse(process.argv);
