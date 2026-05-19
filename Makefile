# Makefile for building, packaging and running revroute-docs.
#
# Two Dockerfile flavours:
#   Dockerfile         — multi-stage, builds inside Docker (~3-5 min).
#                        Use on CI runners with enough RAM.
#   Dockerfile.serve   — packages a pre-built .next/standalone into an image
#                        (~10 seconds). Use after `make build`.
#
# Typical flows:
#
#   Local dev / RAM-constrained host:
#     make build && make image && make up
#
#   CI on GitHub-hosted runner (16 GB RAM):
#     make build && make image-push REGISTRY=ghcr.io/<org> TAG=$(git rev-parse --short HEAD)
#
#   Server pulls pre-built image from registry:
#     make pull TAG=<sha> && make up

SHELL := /bin/bash

# ----- Configurable variables -----
IMAGE       ?= revroute-docs
TAG         ?= latest
REGISTRY    ?=
COMPOSE     ?= docker compose
ENV_FILE    ?= .env

ifeq ($(REGISTRY),)
  FULL_IMAGE := $(IMAGE):$(TAG)
else
  FULL_IMAGE := $(REGISTRY)/$(IMAGE):$(TAG)
endif

# ----- Targets -----

.PHONY: help
help:  ## Print this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install:  ## npm ci
	npm ci

.PHONY: build
build:  ## Native Next.js build (creates .next/standalone + pagefind index)
	# 4 GB heap is generous for docs; this site builds fine with default 2 GB.
	# Adjust if you add many MDX pages or heavy translation imports.
	NODE_OPTIONS="--max-old-space-size=4096" npm run build

.PHONY: clean
clean:  ## Remove build artefacts
	rm -rf .next public/_pagefind

# ----- Docker images -----

.PHONY: image
image:  ## Package the native build into a Docker image via Dockerfile.serve
	@test -d .next/standalone || { echo "ERROR: no .next/standalone — run 'make build' first" >&2; exit 1; }
	docker build -t $(FULL_IMAGE) -f Dockerfile.serve .

.PHONY: image-full
image-full:  ## Build the multi-stage image (compiles inside Docker — slow)
	docker build -t $(FULL_IMAGE) -f Dockerfile .

.PHONY: image-push
image-push: image  ## Build + push the serve image to $(REGISTRY)
	@test -n "$(REGISTRY)" || { echo "ERROR: REGISTRY is empty" >&2; exit 1; }
	docker push $(FULL_IMAGE)

.PHONY: pull
pull:  ## Pull a pre-built image from $(REGISTRY)
	@test -n "$(REGISTRY)" || { echo "ERROR: REGISTRY is empty" >&2; exit 1; }
	docker pull $(FULL_IMAGE)

# ----- Compose lifecycle -----

.PHONY: up
up:  ## Start docs container in background
	$(COMPOSE) --env-file $(ENV_FILE) up -d --force-recreate docs

.PHONY: down
down:  ## Stop and remove the docs container
	$(COMPOSE) --env-file $(ENV_FILE) down

.PHONY: restart
restart: down up  ## Restart docs container

.PHONY: logs
logs:  ## Tail docs container logs
	$(COMPOSE) --env-file $(ENV_FILE) logs -f --tail=100 docs

.PHONY: ps
ps:  ## Show container status
	$(COMPOSE) --env-file $(ENV_FILE) ps

.PHONY: shell
shell:  ## Open a shell inside the running docs container
	$(COMPOSE) --env-file $(ENV_FILE) exec docs /bin/sh
