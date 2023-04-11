FROM debian:bullseye

WORKDIR /app

RUN apt-get update && apt-get -y install --no-install-recommends \
    postgresql-client \
    python3 \
    python3-pip

# Apt cleanup
RUN apt-get autoremove -y; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install python setuptools
RUN python3 -m pip install -r requirements.txt

ADD backup.py .

ENTRYPOINT [ "python3", "backup.py" ]