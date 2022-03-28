import slog from '@/single-line-log';

export class ProgressBar {
  description: string;
  length: number;
  constructor(description: string, bar_length?: number) {
    this.description = description || 'Progress';
    this.length = bar_length || 25; // 进度条的长度(单位：字符)，默认设为 25
  }
  public render(opts: { completed: number; total: number }, text: string) {
    let percent = +(opts.completed / opts.total).toFixed(4); // 计算进度(子任务的 完成数 除以 总数)
    const cell_num = Math.floor(percent * this.length); // 计算需要多少个 █ 符号来拼凑图案
    // 拼接黑色条
    let cell = '';
    for (let i = 0; i < cell_num; i++) {
      cell += '█';
    }
    //     // 拼接灰色条
    let empty = '';
    for (let i = 0; i < this.length - cell_num; i++) {
      empty += '░';
    }
    // 拼接最终文本
    const cmdText = this.description + ': ' + (100 * percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total + text;
    // 在单行输出文本
    slog.stdout(cmdText);
  }
}
// export default ProgressBar;
