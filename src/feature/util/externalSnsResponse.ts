import { HttpStatusCode } from 'src/enum/httpStatusCode';

export class ExternalResponse {
  static responseResult(externalSnsUrl: string) {
    if (externalSnsUrl) {
      return HttpStatusCode.ok;
    } else {
      return HttpStatusCode.internalServerError;
    }
  }
}
