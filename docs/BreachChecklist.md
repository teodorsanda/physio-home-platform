# Security Incident Checklist

1. **Detect & contain**
   - Trigger SOC alert via monitoring (Prisma logs, Redis metrics, MinIO access logs).
   - Disable compromised credentials and revoke active sessions.
   - Isolate affected containers in Kubernetes / Docker Compose environment.
2. **Assess impact**
   - Identify affected data sets (booking table, document bucket, audit logs).
   - Determine number of data subjects and PHI categories exposed.
   - Document timeline and attack vector.
3. **Notify**
   - Inform DPO and leadership within 24h.
   - Notify ANSPDCP within 72h if risk to rights/freedoms is likely.
   - Communicate with impacted users using templated emails and in-app banner.
4. **Remediate**
   - Rotate secrets and regenerate API keys (Stripe, Twilio, Google Maps).
   - Patch vulnerabilities and redeploy containers.
   - Run post-incident review and update DPIA/RoPA if scope changed.
5. **Evidence & lessons**
   - Preserve forensic copies of logs and database snapshots.
   - Update runbooks and automated tests covering regression.
