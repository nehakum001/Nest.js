import { Dependencies, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';

@Injectable()
@Dependencies(HttpService)
export class VdrService {
    constructor(private readonly httpService: HttpService) {}

    public static username: string = "simply_sa_uat";
    public static password: string = "eWpaMXJxayc3WbRPzM";
    public static url: string = "https://apps.factory.p171649450587.aws-emea.sanofi.com/uat/emea/simply-fastapi/api/golden_batch/sites_strains_campaigns";

    /**
     * This function uses node-fetch to invoke external APIs
     * and returns recieved response.
     * @returns
     */
    async getSiteStrainCampaignsWithNodeFetch(): Promise<any> {
        try {
            const response = await fetch(VdrService.url, {
                method: 'GET',
                headers: {
                    'Authorization': await this.getAuthHeader(),
                },
            });
            console.log("Response: ", response.json());
            return response.json();
        } catch(error) {
            console.log("Error: ", error);
        }
    }

    /**
     * This function uses http-module(axios wrapper by NestJs)
     * to invoke external APIs and returns recieved response.
     * @returns 
     */
    async getSiteStrainCampaignsWithAxiosHttpModule(): Promise<any> {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: await this.getAuthHeader()
            },
        };
        try {
            const response = await this.httpService.axiosRef.get(VdrService.url, config);
            console.log("Response: ", response.data);
            return response.data;
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    /**
     * This function encodes username and password combination to base64
     * and returns the results appending to "Basic " string.
     * @returns 
     */
    async getAuthHeader(): Promise<string> {
        return 'Basic ' + Buffer.from(VdrService.username + ':' + VdrService.password).toString('base64');
    }
  
}
