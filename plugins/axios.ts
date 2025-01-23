import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default function ({ $axios }: { $axios: NuxtAxiosInstance }) {
  $axios.onRequest(async (config) => {
    if (!document.cookie.includes("XSRF-TOKEN")) {
      await $axios.get("/sanctum/csrf-cookie");
    }
    return config;
  });
}
