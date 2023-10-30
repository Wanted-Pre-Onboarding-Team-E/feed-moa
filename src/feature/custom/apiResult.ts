import { ErrorMessage } from '../../error/error.enum';

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
  message: ErrorMessage;
};

export type ApiResult<T> = SuccessResult<T> | FailResult;
