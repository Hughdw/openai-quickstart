// 上传的状态：init, uploading, success, failure
export const enum UploadStatusEnum {
  Init,
  Uploading,
  Success,
  Fail
}

export const enum TranslatorStatusEnum {
  Init,
  Translating,
  Success,
  Fail
}

export enum LanguageEnum {
  zh_CN = 'zh_CN',
  pt_BR = 'pt_BR',
  en_US = 'en_US',
  ja_JP = 'ja_JP',
  id_ID = 'id_ID',
  fa_IR = 'fa_IR',
  bn_BD = 'bn_BD'
}

export enum LanguageLabelEnum {
  zh_CN = '中文',
  en_US = '美式英语',
  pt_BR = '葡萄牙语',
  ja_JP = '日语',
  id_ID = '印度尼西亚语',
  fa_IR = '波斯语',
  bn_BD = '孟加拉语'
}

export enum TargetFileFormatEnum {
  PDF = 'pdf',
  Markdown = 'markdown'
}
