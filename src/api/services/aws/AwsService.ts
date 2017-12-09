import S3 = require("aws-sdk/clients/s3");
import Invoice from "../../dto/Invoice";

export interface AwsService {
    listObjects(params: S3.Types.ListObjectsRequest): Promise<S3.Types.ListObjectsOutput>;

    getObject(params: S3.Types.GetObjectRequest): Promise<S3.Types.GetObjectOutput>;

    getNextInvoiceNumber(): Promise<number>;
}

class AwsServiceImpl implements AwsService {

    private s3: S3;
    private bucket: string;

    private mapContent = async (content) => {
        let dataToDownload = {Bucket: this.bucket, Key: content.Key};
        return this.getObject(dataToDownload);
    };

    constructor(s3: S3, bucket: string) {
        this.s3 = s3;
        this.bucket = bucket;
    }

    listObjects(params: S3.Types.ListObjectsRequest) {
        return new Promise<S3.Types.ListObjectsOutput>((resolve, reject) => {
            this.s3.listObjects(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getObject(params: S3.Types.GetObjectRequest) {
        return new Promise<S3.Types.GetObjectOutput>((resolve, reject) => {
            this.s3.getObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async getNextInvoiceNumber() {
        const shallowList = await this.listObjects({Bucket: this.bucket});
        const contentList = shallowList.Contents ? shallowList.Contents : [];
        const detailedList = await Promise.all(contentList.map(this.mapContent));
        let current = detailedList
            .reduce((acc, current) => {
                if (current.Metadata) {
                    let intVal = parseInt(current.Metadata.ocr);
                    return intVal > acc ? intVal : acc;
                } else {
                    return acc;
                }
            }, 0);
        return current + 1;
    }
}

export function getAwsService(s3: S3, bucket: string) {
    return new AwsServiceImpl(s3, bucket);
}
