CREATE USER {{ exporter_username }} WITH PASSWORD '{{ exporter_password }}' CONNECTION LIMIT 3;

GRANT pg_monitor TO {{ exporter_username }};
