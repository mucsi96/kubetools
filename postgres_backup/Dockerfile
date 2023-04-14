FROM debian:bullseye

WORKDIR /app

RUN apt-get update && apt-get -y install --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    lsb-release

# Configure the PostgreSQL apt repository.
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg
RUN echo \
  "deb [signed-by=/etc/apt/trusted.gpg.d/apt.postgresql.org.gpg] http://apt.postgresql.org/pub/repos/apt \
  $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null

RUN apt-get update && apt-get -y install --no-install-recommends \
    postgresql-client \
    python3 \
    python3-pip \
    postgresql-client-15

# Apt cleanup
RUN apt-get autoremove -y; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install python setuptools
RUN python3 -m pip install -r requirements.txt

ADD server.py .

ENTRYPOINT [ "gunicorn", "server:app" ]