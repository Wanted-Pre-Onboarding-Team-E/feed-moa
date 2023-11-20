import { ErrorType } from '../../enum/errorType.enum';

type SuccessResult<T> = T extends void
  ? {
      success: true;
    }
  : {
      success: true;
      data: T;
    };

type FailResult = {
  success: false;
  message: ErrorType;
};

export type ApiResult<T> = SuccessResult<T> | FailResult;
