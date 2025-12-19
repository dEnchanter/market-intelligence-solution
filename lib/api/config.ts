import { getToken } from "../utils/auth";

export const API_CONFIG = {
  BASE_URL: "http://172.239.103.176:8070",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
    },
    CONSUMPTION_ITEMS: {
      IMPORT: "/api/consumption-items/import",
      LIST: "/api/consumption-items",
    },
    DISTRICTS: {
      BASE: "/api/districts",
      BY_ID: (id: string) => `/api/districts/${id}`,
    },
    GEO: {
      DISTRICT_LGAS: (id: string) => `/api/geo/states/${id}/lgas`,
      STATES: "/api/geo/states",
      UPLOAD: "/api/geo/upload",
    },
    HOUSEHOLD_EXPENDITURES: {
      BASE: "/api/household-expenditures",
      STATS: "/api/household-expenditures/stats",
      UPDATE_PRICE: (id: string) => `/api/household-expenditures/${id}/price`,
    },
    HOUSEHOLD_ITEMS: {
      BASE: "/api/household-items",
    },
    HOUSEHOLDS: {
      BASE: "/api/households",
      NEARBY: "/api/households/nearby",
    },
    MARKET_PRICES: {
      BASE: "/api/market-prices",
      STATS: "/api/market-prices/stats",
      UPDATE_PRICE: (id: string) => `/api/market-prices/${id}/price`,
    },
    MARKETS: {
      BASE: "/api/markets",
      NEARBY: "/api/markets/nearby",
      BY_ID: (id: string) => `/api/markets/${id}`,
      STATUS: (id: string) => `/api/markets/${id}/status`,
    },
    REPORTING: {
      MARKET_HOUSEHOLD: "/api/reporting/market-household",
      MY_MARKET_HOUSEHOLD: "/api/reporting/my-market-household",
    },
    STATS: {
      SUMMARY: "/api/stats/summary",
    },
    USERS: {
      BASE: "/api/users",
      CHANGE_PASSWORD: "/api/users/change-password",
      BY_ID: (id: string) => `/api/users/${id}`,
      RESET_PASSWORD: (id: string) => `/api/users/${id}/reset-password`,
      CHECK_PHONE: "/api/users/check-phone",
    },
  },
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getAuthHeaders = () => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};
