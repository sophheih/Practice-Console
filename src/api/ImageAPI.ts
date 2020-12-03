/* eslint-disable no-invalid-this */

import { FileType } from "rsuite/lib/Uploader";
import { AuthedFetchFunction } from "../hooks/useAPIs";
import { buildImage, Image } from "../models/definitions";
import { ErrorResponse } from "../models/types";

export default class ImageAPI {
    authedFetch : AuthedFetchFunction;
    constructor(authedFetch: AuthedFetchFunction) {
        this.authedFetch = authedFetch;
    }

    upload = (file: FileType) => {
        return new Promise<Image>((resolve, reject) => {
            if (file.blobFile && file.name) {
                const requestBody = new FormData();
                requestBody.append("image", file.blobFile);
                requestBody.append("ext", file.name.split(".")[file.name.split(".").length - 1]);

                let ok = false;
                let resdata;
                this.authedFetch("/image/", "POST", requestBody)
                    .then((res) => {
                        ok = res.status === 201;
                        return res.json();
                    })
                    .then((res) => {
                        if (ok) {
                            resdata = res as Image;
                            resolve(buildImage(resdata));
                        } else {
                            resdata = res as ErrorResponse;
                            reject(resdata.message);
                        }
                    });
            } else {
                reject(new Error("EMPTY_FILE"));
            }
        });
    };

    delete = (data: Image) => {
        return new Promise<void>((resolve, reject) => {
            let ok = false;
            let resdata;
            this.authedFetch(`/image/${data.id}`, "DELETE")
                .then((res) => {
                    if (res.status === 202) ok = true;
                    return res.json();
                })
                .then((res: any) => {
                    if (ok) {
                        resolve();
                    } else {
                        resdata = res as ErrorResponse;
                        reject(resdata.message);
                    }
                });
        });
    };
}
