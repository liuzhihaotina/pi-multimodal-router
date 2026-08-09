/**
 * SiliconFlow API Client
 */

export interface SiliconFlowConfig {
  baseUrl: string;
  apiKey: string;
}

export class SiliconFlowClient {
  private config: SiliconFlowConfig;

  constructor(config: SiliconFlowConfig) {
    this.config = config;
  }

  async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SiliconFlow API error (${response.status}): ${errorText}`
      );
    }

    return response;
  }

  async post(endpoint: string, body: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return response.json();
  }

  async get(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, {
      method: "GET",
    });

    return response.json();
  }

  async postFormData(endpoint: string, formData: FormData): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.config.apiKey}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SiliconFlow API error (${response.status}): ${errorText}`
      );
    }

    return response.json();
  }
}
