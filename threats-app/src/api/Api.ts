/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ThreatListSerializer {
  id?: number;
  name?: string;
  description?: string;
  /** @format float */
  price?: number;
}

export interface ThreatDetailSerializer {
  id?: number;
  name?: string;
  description?: string;
  /** @format float */
  price?: number;
  image?: string;
}

export interface RequestSerializer {
  id?: number;
  user?: string;
  status?: string;
  /** @format date-time */
  created_at?: string;
}

export interface PutRequestSerializer {
  status?: string;
}

export interface AcceptRequestSerializer {
  accepted?: boolean;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Threat Management API
 * @version 1.0.0
 *
 * API for managing threats, requests, and user profiles.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  threats = {
    /**
     * @description Get a list of all threats, optionally filtered by price range or name.
     *
     * @name ThreatsList
     * @summary Get a list of threats
     * @request GET:/threats/
     * @secure
     */
    threatsList: (
      query?: {
        /**
         * Minimum price of threat
         * @format float
         */
        price_from?: number;
        /**
         * Maximum price of threat
         * @format float
         */
        price_to?: number;
        /** Name of the threat */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ThreatListSerializer[], any>({
        path: `/threats/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Adds a new threat to the system. Accessible only to moderators.
     *
     * @name DetailCreate
     * @summary Add a new threat (moderators only)
     * @request POST:/threats/detail/
     * @secure
     */
    detailCreate: (data: ThreatDetailSerializer, params: RequestParams = {}) =>
      this.request<ThreatDetailSerializer, void>({
        path: `/threats/detail/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific threat by its ID.
     *
     * @name DetailDetail
     * @summary Get details of a specific threat
     * @request GET:/threats/detail/{pk}/
     * @secure
     */
    detailDetail: (pk: number, params: RequestParams = {}) =>
      this.request<ThreatDetailSerializer, any>({
        path: `/threats/detail/${pk}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update details of an existing threat. Accessible only to moderators.
     *
     * @name DetailUpdate
     * @summary Update a specific threat (moderators only)
     * @request PUT:/threats/detail/{pk}/
     * @secure
     */
    detailUpdate: (pk: number, data: ThreatDetailSerializer, params: RequestParams = {}) =>
      this.request<ThreatDetailSerializer, void>({
        path: `/threats/detail/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark a threat as deleted. Accessible only to moderators.
     *
     * @name DetailDelete
     * @summary Delete a specific threat (moderators only)
     * @request DELETE:/threats/detail/{pk}/
     * @secure
     */
    detailDelete: (pk: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/threats/detail/${pk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Adds a specific threat to a user's draft request. If no draft request exists, a new request is created.
     *
     * @name PostThreats
     * @summary Add a threat to a user's draft request
     * @request POST:/threats/add/{pk}/
     * @secure
     */
    postThreats: (
      pk: number,
      data: {
        /**
         * Price of the threat
         * @format float
         * @example 100
         */
        price?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/threats/add/${pk}/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Upload an image for a specific threat. Accessible only to moderators.
     *
     * @name ImageCreate
     * @summary Upload an image for a specific threat (moderators only)
     * @request POST:/threats/image/
     * @secure
     */
    imageCreate: (
      data: {
        /** @format binary */
        pic?: File;
        /** ID of the threat to upload the image for */
        threat_id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/threats/image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  requests = {
    /**
     * @description Get a list of all requests, optionally filtered by date and status.
     *
     * @name RequestsList
     * @summary Get a list of requests
     * @request GET:/requests/
     * @secure
     */
    requestsList: (
      query?: {
        /**
         * Filter requests by date
         * @format date
         */
        date?: string;
        /** Filter requests by status */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RequestSerializer[], any>({
        path: `/requests/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve detailed information about a specific request, including associated threats.
     *
     * @name RequestsDetail
     * @summary Get details of a specific request
     * @request GET:/requests/{pk}/
     * @secure
     */
    requestsDetail: (pk: number, params: RequestParams = {}) =>
      this.request<RequestSerializer, any>({
        path: `/requests/${pk}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update details of an existing request.
     *
     * @name RequestsUpdate
     * @summary Update a specific request
     * @request PUT:/requests/{pk}/
     * @secure
     */
    requestsUpdate: (pk: number, data: PutRequestSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/requests/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Mark a draft request as formed. Only available for requests with a 'draft' status.
     *
     * @name FormUpdate
     * @summary Mark a request as formed
     * @request PUT:/requests/form/{pk}/
     * @secure
     */
    formUpdate: (pk: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/requests/form/${pk}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Approve or decline a request. Only available for moderators.
     *
     * @name ModerateUpdate
     * @summary Approve or decline a request (moderators only)
     * @request PUT:/requests/moderate/{pk}/
     * @secure
     */
    moderateUpdate: (pk: number, data: AcceptRequestSerializer, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/requests/moderate/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a request. Only available for moderators.
     *
     * @name ModerateDelete
     * @summary Delete a request (moderators only)
     * @request DELETE:/requests/moderate/{pk}/
     * @secure
     */
    moderateDelete: (pk: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/requests/moderate/${pk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  requestThreat = {
    /**
     * @description Remove a specific threat from a request.
     *
     * @name RequestThreatDelete
     * @summary Remove a threat from a request
     * @request DELETE:/request-threat/{pk}/
     * @secure
     */
    requestThreatDelete: (
      pk: number,
      data: {
        /** ID of the threat to remove */
        threat_id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/request-threat/${pk}/`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Update the price of a specific threat in a request.
     *
     * @name RequestThreatUpdate
     * @summary Update the price of a threat in a request
     * @request PUT:/request-threat/{pk}/
     * @secure
     */
    requestThreatUpdate: (
      pk: number,
      data: {
        /**
         * New price of the threat
         * @format float
         * @example 150
         */
        price?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/request-threat/${pk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
