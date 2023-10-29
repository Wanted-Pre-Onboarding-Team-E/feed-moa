import { ErrorMessage } from 'src/error/error.enum';

type SuccessResult<T> = {
  success: true;
  data: T;
};

type FailResult = {
  success: false;
  message: ErrorMessage;
};

export type ApiResult<T> = SuccessResult<T> | FailResult;
