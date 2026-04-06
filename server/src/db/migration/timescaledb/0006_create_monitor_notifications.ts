import type { Pool } from "pg";

export const createMonitorNotifications = async (pool: Pool) => {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS monitor_notifications (
			monitor_id      UUID NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
			notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
			escalation_delay_minutes INTEGER,
			escalation_channel_id UUID REFERENCES notifications(id) ON DELETE SET NULL,
			PRIMARY KEY (monitor_id, notification_id)
		);

		ALTER TABLE monitor_notifications
			ADD COLUMN IF NOT EXISTS escalation_delay_minutes INTEGER;

		ALTER TABLE monitor_notifications
			ADD COLUMN IF NOT EXISTS escalation_channel_id UUID REFERENCES notifications(id) ON DELETE SET NULL;

		CREATE INDEX IF NOT EXISTS idx_monitor_notifications_notification
			ON monitor_notifications (notification_id);

		CREATE INDEX IF NOT EXISTS idx_monitor_notifications_escalation_channel
			ON monitor_notifications (escalation_channel_id);
	`);
};

export const dropMonitorNotifications = async (pool: Pool) => {
	await pool.query(`DROP TABLE IF EXISTS monitor_notifications;`);
};
