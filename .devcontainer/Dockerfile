FROM mcr.microsoft.com/vscode/devcontainers/base:bullseye

ARG USERNAME=vscode
ARG USER_HOME=/home/${USERNAME}
ARG WORKSPACE_HOME=/workspaces/kubetools

RUN apt-get update && apt-get -y install lsb-release

# Configure the Eclipse Adoptium apt repository.
RUN mkdir -p /etc/apt/keyrings
RUN wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /etc/apt/keyrings/adoptium.asc
RUN echo \
  "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb \
   $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list

# Configure the Docker’s official apt repository.
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Configure the PostgreSQL apt repository.
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg
RUN echo \
  "deb [signed-by=/etc/apt/trusted.gpg.d/apt.postgresql.org.gpg] http://apt.postgresql.org/pub/repos/apt \
  $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null

# Configure NodeSource
RUN curl -fsSL -o get_node.sh https://deb.nodesource.com/setup_18.x \
    && chmod 700 get_node.sh \
    && ./get_node.sh

RUN apt-get update && apt-get -y install --no-install-recommends \
    sshpass \
    chromium \
    chromium-sandbox \
    chromium-driver \
    temurin-17-jdk \
    docker-ce-cli \
    nodejs \
    python3 \
    python3-pip \
    maven \
    postgresql-client-15

# Apt cleanup
RUN apt-get autoremove -y; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*

# Install python setuptools
RUN python3 -m pip install --upgrade setuptools

# [Optional] Allow the vscode user to pip install globally w/o sudo
ENV PIP_TARGET=/usr/local/pip-global
ENV PYTHONPATH=${PIP_TARGET}:${PYTHONPATH}
ENV PATH=${PIP_TARGET}/bin:${PATH}
RUN if ! cat /etc/group | grep -e "^pip-global:" > /dev/null 2>&1; then groupadd -r pip-global; fi \
    && usermod -a -G pip-global vscode \
    && umask 0002 && mkdir -p ${PIP_TARGET} \
    && chown :pip-global ${PIP_TARGET} \
    && ( [ ! -f "/etc/profile.d/00-restore-env.sh" ] || sed -i -e "s/export PATH=/export PATH=\/usr\/local\/pip-global:/" /etc/profile.d/00-restore-env.sh )

# Install kubectl
RUN curl -sSL -o /usr/local/bin/kubectl https://dl.k8s.io/release/v1.25.3/bin/linux/amd64/kubectl \
    && chmod 0755 /usr/local/bin/kubectl

# Install Helm
RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \
    && chmod 700 get_helm.sh \
    && ./get_helm.sh --version v3.11.1

# Install cloudflared
RUN wget -q "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-$(dpkg --print-architecture).deb" && dpkg -i "cloudflared-linux-$(dpkg --print-architecture).deb"

# Install pack
RUN curl -sSL https://github.com/buildpacks/pack/releases/download/v0.28.0/pack-v0.28.0-linux.tgz | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack

ENV ANSIBLE_CONFIG=${WORKSPACE_HOME}/ansible.cfg
ENV KUBECONFIG=${USER_HOME}/.kube/ansible-config
ENV CHROME_BIN=/usr/bin/chromium
ENV CHOKIDAR_USEPOLLING=true
COPY .bashrc ${USER_HOME}

# Install Angular CLI
RUN npm install -g @angular/cli yarn