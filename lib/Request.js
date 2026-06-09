'use strict';

const axios     = require('axios');
const Errors	= require('./utils/Errors');

/**
 * HTTP client for MonCash API requests with OAuth2 token management.
 */
class Request{
    /**
     * @param {object} config - SDK configuration
     * @param {object} headers - Default request headers
     */
    constructor(config,headers){
        this.config  = config;
        this.headers = headers;
        this._authPromise = null;

        this.instance = axios.create({
            baseURL:this.config.endpoint,
            headers: this.headers,
            timeout: 30000
        });
    }

    /**
     * Remove sensitive credentials from error messages.
     * @param {string} message - Raw error message
     * @returns {string} Sanitized message
     * @private
     */
    _sanitizeMessage(message) {
        if (!message || typeof message !== 'string') {
            return 'Request failed';
        }

        const secret = this.config.clientSecret;
        if (secret && message.includes(secret)) {
            return message.split(secret).join('[REDACTED]');
        }

        return message;
    }

    /**
     * Obtain or refresh an OAuth2 access token.
     * @param {string} [clientId] - Optional client ID override
     * @param {string} [clientSecret] - Optional client secret override
     * @returns {Promise<object>} OAuth token response
     */
    authenticate(clientId,clientSecret){

        return new Promise((res,rej)=>{
            if (clientId) {
                this.config.clientId = clientId;
            }
    
            if (clientSecret) {
                this.config.clientSecret = clientSecret;
            }
    
            
            let data = new URLSearchParams();

            data.append('scope','read,write');
            data.append('grant_type','client_credentials');

            this.instance.post('/oauth/token',data,
            {
                headers:{
                    ...this.headers,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth:{
                    username:this.config.clientId,
                    password:this.config.clientSecret
                }
            })
            .then((resp)=>{
                this.headers = {
                    ...this.headers,
                    Authorization:'Bearer ' + resp.data.access_token
                };
    
                this.token_expires_at = parseInt(new Date().getTime() / 1000) + parseInt(resp.data.expires_in) - 6;

                res(resp.data);
            })
            .catch((err)=>{
                const message = this._sanitizeMessage(
                    err.response?.data?.error_description ||
                    err.response?.data?.message ||
                    err.message
                );
                rej(new Errors.MoncashError(message || 'Authentication failed'));
            });

        });
        
    }

    /**
     * Ensure a valid Bearer token is available, reusing in-flight authentication.
     * @returns {Promise<void>}
     * @private
     */
    async _ensureAuthenticated() {
        const now = parseInt(new Date().getTime() / 1000);
        const hasValidToken = this.headers.Authorization?.startsWith('Bearer ') &&
            this.token_expires_at >= now;

        if (hasValidToken) {
            return;
        }

        if (this._authPromise) {
            return this._authPromise;
        }

        this._authPromise = this.authenticate()
            .finally(() => {
                this._authPromise = null;
            });

        return this._authPromise;
    }

    /**
     * Send an authenticated POST request.
     * @param {string} path - API path
     * @param {object} data - Request body
     * @param {object} [headers] - Additional headers
     * @returns {Promise<object>} Response data
     */
    async post(path,data,headers){
        try {
            await this._ensureAuthenticated();
            
            const resp = await this.instance.post(path,data,{
                headers:{
                    ...this.headers,
                    ...headers
                }
            });

            return resp.data;
        } 
        catch (error) {
            if (error instanceof Errors.MoncashError) {
                throw error;
            }
            if (!error.response) {
                throw new Errors.MoncashError(this._sanitizeMessage(error.message));
            }
            throw Errors.MoncashError.generate(error.response.status);
        }
    }

    // async get(path,params,headers){
    //     try {
    //         await this._ensureAuthenticated();
    
    //         return this.instance.get(path,{params},{
    //             headers:{
    //                 ...this.headers,
    //                 ...headers
    //             }
    //         });
    //     } 
    //     catch (error) {
    //         return error;
    //     }
    // }
}

module.exports = Request;
