export const sourceTypes = [
  { value: 'mysql', label: 'Tap MySQL', supported: true, iconSlug: 'mysql' },
  { value: 'postgres', label: 'Tap PostgreSQL', supported: true, iconSlug: 'postgresql' },
  { value: 's3_csv', label: 'Tap S3 CSV', supported: false, iconSlug: 'amazons3' },
  { value: 'kafka', label: 'Tap Kafka', supported: false, iconSlug: 'apachekafka' },
  { value: 'snowflake', label: 'Tap Snowflake', supported: false, iconSlug: 'snowflake' },
  { value: 'mongodb', label: 'Tap MongoDB', supported: false, iconSlug: 'mongodb' },
  { value: 'zendesk', label: 'Tap Zendesk', supported: false, iconSlug: 'zendesk' },
  { value: 'jira', label: 'Tap Jira', supported: false, iconSlug: 'jira' },
  { value: 'github', label: 'Tap Github', supported: false, iconSlug: 'github' },
  { value: 'slack', label: 'Tap Slack', supported: false, iconSlug: 'slack' },
  { value: 'mixpanel', label: 'Tap Mixpanel', supported: false, iconSlug: 'mixpanel' }
];

export const targetTypes = [
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'csv', label: 'CSV' },
  { value: 's3', label: 'Amazon S3' }
];
