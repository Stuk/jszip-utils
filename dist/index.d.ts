declare function _getBinaryFromXHR(xhr: XMLHttpRequest): any;
declare type CallbackData = string | ArrayBuffer;
interface GetBinaryContentCallback {
    (err: null, data: CallbackData): void;
    (err: Error, data: null): void;
}
interface GetBinaryContentProgressData {
    path: string;
    originalEvent: ProgressEvent;
    percent: number;
    loaded: ProgressEvent['loaded'];
    total: ProgressEvent['total'];
}
declare type GetBinaryContentProgress = (data: GetBinaryContentProgressData) => void;
declare type GetBinaryContentOptions = {
    callback: GetBinaryContentCallback;
    progress?: GetBinaryContentProgress;
};
/**
 * @param  {string} path    The path to the resource to GET.
 * @param  {function|{callback: function, progress: function}} options
 * @return {Promise|undefined} If no callback is passed then a promise is returned
 */
declare function getBinaryContent(path: string, options?: never): Promise<CallbackData>;
declare function getBinaryContent(path: string, options: GetBinaryContentCallback | GetBinaryContentOptions): void;
declare const JSZipUtils: {
    _getBinaryFromXHR: typeof _getBinaryFromXHR;
    getBinaryContent: typeof getBinaryContent;
};
export default JSZipUtils;
