import S3 = require("aws-sdk/clients/s3");

export interface AwsService {
    listObjects(params: S3.Types.ListObjectsRequest) : Promise<S3.Types.ListObjectsOutput>;
    getObject(params: S3.Types.GetObjectRequest) : Promise<S3.Types.GetObjectOutput>;
    getNextInvoiceNumber() : Promise<number>;
}

class AwsServiceImpl implements AwsService {

    private s3 : S3;
    private bucket : string;

    private mapContent = async (content) => {
        let dataToDownload = {Bucket: this.bucket, Key: content.Key};
        return this.getObject(dataToDownload);
    };

    constructor(s3:S3, bucket: string) {
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
        const detailedList = await Promise.all(shallowList.Contents.map(this.mapContent));
        let current = detailedList
            .map(elem => elem.Metadata.ocr)
            .reduce((maxValue, currentValue) => {
            if (currentValue === undefined) {
                return maxValue;
            } else {
                let intVal = parseInt(currentValue);
                return intVal > maxValue ? intVal : maxValue;
            }
        }, 0);
        return current + 1;
    }
}

export function getAwsService(s3:S3, bucket: string) {
    return new AwsServiceImpl(s3, bucket);
};