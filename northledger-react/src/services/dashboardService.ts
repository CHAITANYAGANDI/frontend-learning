import { DASHBOARD_SUMMARY_URL } from "../constants/api";
import type { DashboardSummary } from "../types/dashboard";

export async function getDashboardSummary(accessToken: string) : Promise<DashboardSummary> {

    const response = await fetch(DASHBOARD_SUMMARY_URL, {
        method:"GET",
        headers:{
            "Authorization": "Bearer " + accessToken
        }
    });

    if (!response.ok){
        throw new Error("Failed to load dashboard summary");
    }

    const dashboardSummary: DashboardSummary = await response.json();

    return dashboardSummary;
    
}