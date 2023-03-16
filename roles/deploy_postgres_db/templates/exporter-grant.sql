CREATE USER '{{ exporter_username }}' IDENTIFIED BY '{{ exporter_password }}' WITH MAX_USER_CONNECTIONS 3;

GRANT pg_monitor TO '{{ exporter_username }}';
