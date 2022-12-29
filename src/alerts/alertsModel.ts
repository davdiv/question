export interface Alert {
	type: string;
	message: string;
}
export type Alerts = Alert[];

export const addAlert = (alerts: Alerts, message: string, type = "danger") => {
	alerts.push({ type, message });
	return alerts;
};

export const removeAlert = (alerts: Alerts, index: number) => {
	alerts.splice(index, 1);
	return alerts;
};

export const clearAlerts = (): Alerts => [];
