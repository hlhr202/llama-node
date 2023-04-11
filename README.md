# llama-node

Large Language Model LLaMA on node.js

This project is in an early stage, the API for nodejs may change in the future, use it with caution.

[中文文档](./README-zh-CN.md)

<img src="./doc/assets/llama.png" width="300px" height="300px" alt="LLaMA generated by Stable diffusion"/>

<sub>Picture generated by stable diffusion.</sub>


![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/hlhr202/llama-node/llama-build.yml)
![NPM](https://img.shields.io/npm/l/llama-node)
[<img alt="npm" src="https://img.shields.io/npm/v/llama-node">](https://www.npmjs.com/package/llama-node)
![npm type definitions](https://img.shields.io/npm/types/llama-node)
[<img alt="twitter" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Ftwitter.com%2Fhlhr202">](https://twitter.com/hlhr202)

---

- [llama-node](#llama-node)
  - [Introduction](#introduction)
  - [Getting the weights](#getting-the-weights)
    - [Model versioning](#model-versioning)
  - [Usage](#usage)
    - [Inference](#inference)
    - [Chatting](#chatting)
    - [Tokenize](#tokenize)
    - [Embedding](#embedding)
  - [Performance related](#performance-related)
    - [Manual compilation (from node\_modules)](#manual-compilation-from-node_modules)
    - [Manual compilation (from source)](#manual-compilation-from-source)
  - [Install](#install)
  - [Future plan](#future-plan)

---

## Introduction

This is a nodejs client library for llama LLM built on top of [llama-rs](https://github.com/rustformers/llama-rs). It uses [napi-rs](https://github.com/napi-rs/napi-rs) for channel messages between node.js and llama thread.

Currently supported platforms:
- darwin-x64
- darwin-arm64
- linux-x64-gnu
- win32-x64-msvc


I do not have hardware for testing 13B or larger models, but I have tested it supported llama 7B model with both ggml llama and ggml alpaca.

<!-- Download one of the llama ggml models from the following links:
- [llama 7B int4 (old model for llama.cpp)](https://huggingface.co/hlhr202/llama-7B-ggml-int4/blob/main/ggml-model-q4_0.bin)
- [alpaca 7B int4](https://huggingface.co/hlhr202/alpaca-7B-ggml-int4/blob/main/ggml-alpaca-7b-q4.bin) -->

---

## Getting the weights

The llama-node uses llama-rs under the hook and uses the model format derived from llama.cpp. Due to the fact that the meta-release model is only used for research purposes, this project does not provide model downloads. If you have obtained the original **.pth** model, please read the document [Getting the weights](https://github.com/rustformers/llama-rs#getting-the-weights) and use the convert tool provided by llama-rs for conversion.

### Model versioning

There are now 3 versions from llama.cpp community:

- GGML: legacy format, oldest ggml tensor file format
- GGMF: also legacy format, newer than GGML, older than GGJT
- GGJT: mmap-able format

The llama-rs backend now only supports GGML/GGMF models, so does the llama-node. For GGJT(mmap) models support, please wait for [standalone loader](https://github.com/rustformers/llama-rs/pull/125) to be merged.

---

## Usage

The current version supports only one inference session on one LLama instance at the same time

If you wish to have multiple inference sessions concurrently, you need to create multiple LLama instances

### Inference

```typescript
import path from "path";
import { LLamaClient } from "llama-node";

const model = path.resolve(process.cwd(), "./ggml-alpaca-7b-q4.bin");

const llama = new LLamaClient(
    {
        path: model,
        numCtxTokens: 128,
    },
    true
);

const template = `how are you`;

const prompt = `Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:

${template}

### Response:`;

llama.createTextCompletion(
    {
        prompt,
        numPredict: 128,
        temp: 0.2,
        topP: 1,
        topK: 40,
        repeatPenalty: 1,
        repeatLastN: 64,
        seed: 0,
        feedPrompt: true,
    },
    (response) => {
        process.stdout.write(response.token);
    }
);
```

### Chatting

Working on alpaca, this just make a context of alpaca instructions. Make sure your last message is end with user role.

```typescript
import { LLamaClient } from "llama-node";
import path from "path";

const model = path.resolve(process.cwd(), "./ggml-alpaca-7b-q4.bin");

const llama = new LLamaClient(
    {
        path: model,
        numCtxTokens: 128,
    },
    true
);

const content = "how are you?";

llama.createChatCompletion(
    {
        messages: [{ role: "user", content }],
        numPredict: 128,
        temp: 0.2,
        topP: 1,
        topK: 40,
        repeatPenalty: 1,
        repeatLastN: 64,
        seed: 0,
    },
    (response) => {
        if (!response.completed) {
            process.stdout.write(response.token);
        }
    }
);

```

### Tokenize

Get tokenization result from LLaMA

```typescript
import { LLamaClient } from "llama-node";
import path from "path";

const model = path.resolve(process.cwd(), "./ggml-alpaca-7b-q4.bin");

const llama = new LLamaClient(
    {
        path: model,
        numCtxTokens: 128,
    },
    true
);

const content = "how are you?";

llama.tokenize(content).then(console.log);
```

### Embedding

Preview version, embedding end token may change in the future. Do not use it in production!

```typescript
import { LLamaClient } from "llama-node";
import path from "path";

const model = path.resolve(process.cwd(), "./ggml-alpaca-7b-q4.bin");

const llama = new LLamaClient(
    {
        path: model,
        numCtxTokens: 128,
    },
    true
);

const prompt = `how are you`;

llama
    .getEmbedding({
        prompt,
        numPredict: 128,
        temp: 0.2,
        topP: 1,
        topK: 40,
        repeatPenalty: 1,
        repeatLastN: 64,
        seed: 0,
        feedPrompt: true,
    })
    .then(console.log);

```

---

## Performance related

We provide prebuild binaries for linux-x64, win32-x64, apple-x64, apple-silicon. For other platforms, before you install the npm package, please install rust environment for self built.

Due to complexity of cross compilation, it is hard for pre-building a binary that fits all platform needs with best performance.

If you face low performance issue, I would strongly suggest you do a manual compilation. Otherwise you have to wait for a better pre-compiled native binding. I am trying to investigate the way to produce a matrix of multi-platform supports.

### Manual compilation (from node_modules)

The following steps will allow you to compile the binary with best quality on your platform

- Pre-request: install rust

- Under node_modules/@llama-node/core folder

    ```shell
    npm run build
    ```

### Manual compilation (from source)

The following steps will allow you to compile the binary with best quality on your platform

- Pre-request: install rust

- Under root folder, run

    ```shell
    npm install && npm run build
    ```

- Under packages/core folder, run
    ```shell
    npm run build
    ```

- You can use the dist under root folder

---

## Install
```bash
npm install llama-node
```

---

## Future plan
- [ ] prompt extensions
- [ ] more platforms and cross compile (performance related)
- [ ] tweak embedding API, make end token configurable
- [ ] cli and interactive
- [ ] support more open source models as llama-rs planned https://github.com/rustformers/llama-rs/pull/85 https://github.com/rustformers/llama-rs/issues/75
