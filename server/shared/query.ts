import {Objects} from './objects';

const DEFAULT_PAGE_SIZE = 1000;

export class Query {
  static convertPagingParams(params: any): any {
    var whiteListed = Objects.whiteList(params, ['page', 'pageSize']);

    var pageSize = +(whiteListed.pageSize || DEFAULT_PAGE_SIZE);
    var startIndex = (+(whiteListed.page || 1) - 1) * pageSize;

    return {
      count: pageSize,
      skip: startIndex
    };
  }
}