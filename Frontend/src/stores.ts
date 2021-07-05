import { writable } from "svelte/store";

// CHANGE THIS URL
export const backendServerUrl = writable("https://<Your SERVER URL>:4000");
export const frontendServerUrl = writable("https://<Your SERVER URL>:5000/#");
