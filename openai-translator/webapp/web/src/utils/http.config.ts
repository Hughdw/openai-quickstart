import { extend } from 'umi-request';
import { BaseUrl } from './env';

export const request = extend({
  prefix: BaseUrl.localDev.api
});
