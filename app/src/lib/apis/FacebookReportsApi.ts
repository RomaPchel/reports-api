import axios, { type AxiosInstance } from 'axios';

export class FacebookReportsApi {
    private static readonly api: AxiosInstance = this.getHttpClient();
    private static readonly FACEBOOK_ACCESS_TOKEN: string = process.env.FACEBOOK_ACCESS_TOKEN as string;

    private static getHttpClient(): AxiosInstance {
        const instance = axios.create({
            baseURL: "https://graph.facebook.com/v22.0/act_1083076062681667",
            headers: { "Content-Type": "application/json" },
        });

        instance.interceptors.request.use((config) => {
            config.params = {
                ...config.params,
                access_token: this.FACEBOOK_ACCESS_TOKEN,
            };
            return config;
        });

        return instance;
    }

    public static async getKpis(datePreset: string) {
        try {
            const response = await this.api.get(`/insights`, {
                params: {
                    date_preset: datePreset,
                    fields: 'account_name,account_id,spend,impressions,clicks,cpc,ctr,actions,action_values,cost_per_action_type,purchase_roas,website_purchase_roas',
                    level: 'account',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async getRecommendations() {
        try {
            const response = await this.api.get(`/recommendations`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async getCampaigns(datePreset: string) {
        try {
            const response = await this.api.get(`/insights`, {
                params: {
                    date_preset: datePreset,
                    fields: 'campaign_name,actions,clicks{outbound_clicks,all_clicks},spend,purchase_roas,website_purchase_roas,action_values{add_to_cart}',
                    level: 'campaign',
                    limit: 1000,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async getGraphs(datePreset: string) {
        try {
            const response = await this.api.get(`/insights`, {
                params: {
                    date_preset: datePreset,
                    fields: 'account_name,account_id,spend,impressions,clicks,cpc,ctr,actions,action_values,cost_per_action_type,purchase_roas,website_purchase_roas',
                    level: 'account',
                    time_increment: 1,
                    limit: 1000,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public static async getAds(datePreset: string) {
        try {
            const response = await this.api.get(`/ads`, {
                params: {
                    __cppo: 1,
                    action_breakdowns: 'action_type',
                    fields: 'id,creative{id},insights.date_preset(' + datePreset + '){impressions,clicks,spend,actions{action_type,value},action_values{action_type,value},purchase_roas{action_type,value}}',
                    limit: 1000,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}