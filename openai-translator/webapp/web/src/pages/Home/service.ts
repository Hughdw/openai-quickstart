// import request from "umi-request";

import { request } from '../../utils/http.config';
import { LanguageEnum, TargetFileFormatEnum } from './enum';

// 描述文件的 interface：文件名和文件类型
export interface IFileProfile {
  name: string;
  type: string;
}
interface IFileTranslateApi extends API.BaseResultInter {
  data: string;
}
export async function fileTranslate(
  file: IFileProfile,
  target_format: TargetFileFormatEnum,
  target_language: LanguageEnum = LanguageEnum.zh_CN
) {
  console.log('file', file);
  return request<IFileTranslateApi>(`/api/v1/files/${file.name}/translate`, {
    method: 'POST',
    data: {
      file_type: file.type,
      target_language,
      target_format
    }
  });
}

// 查看文件
export function viewFile(filename: string) {
  window.open(`http://www.aaa.com:5000/uploads/${filename}`);
}
