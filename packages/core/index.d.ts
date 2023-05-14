/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export const enum ModelType {
  Llama = 'Llama',
  Bloom = 'Bloom',
  Gpt2 = 'Gpt2',
  GptJ = 'GptJ',
  NeoX = 'NeoX'
}
export interface InferenceToken {
  token: string
  completed: boolean
}
export const enum InferenceResultType {
  Data = 'Data',
  End = 'End',
  Error = 'Error'
}
export interface InferenceResult {
  type: InferenceResultType
  message?: string
  data?: InferenceToken
}
export interface TokenBias {
  tokenId: TokenId
  bias: number
}
/**
 * LLama model load config
*/
export interface ModelLoad {
  modelType: ModelType
  /** Path of the model */
  modelPath: string
  /**
   * Sets the size of the context (in tokens). Allows feeding longer prompts.
   * Note that this affects memory.
   *
   * LLaMA models are trained with a context size of 2048 tokens. If you
   * want to use a larger context size, you will need to retrain the model,
   * or use a model that was trained with a larger context size.
   *
   * Alternate methods to extend the context, including
   * [context clearing](https://github.com/rustformers/llama-rs/issues/77) are
   * being investigated, but are not yet implemented. Additionally, these
   * will likely not perform as well as a model with a larger context size.
   * Default is 2048
   */
  numCtxTokens?: number
  /**
   * MMapped files are faster, but may not work on all systems.
   * Default is true
   */
  useMmap?: boolean
}
export interface Generate {
  /**
   * Sets the number of threads to use
   * Default is 4
   */
  numThreads: number
  /**
   * Number of tokens to predict
   * Default is 512
   */
  numPredict: number
  /**
   * How many tokens from the prompt at a time to feed the network. Does not
   * affect generation.
   * Default is 8
   */
  batchSize: number
  /**
   * Size of the 'last N' buffer that is used for the `repeat_penalty`
   * Default is 64
   */
  repeatLastN: number
  /**
   * The penalty for repeating tokens. Higher values make the generation less
   * likely to get into a loop, but may harm results when repetitive outputs
   * are desired.
   * Default is 1.30
   */
  repeatPenalty: number
  /**
   * Temperature, higher is more creative, should between 0 to 1
   * Default is 0.80
   */
  temperature: number
  /**
   * Top-K: The top K words by score are kept during sampling.
   * Default is 40
   */
  topK: number
  /**
   * Top-p: The cumulative probability after which no more words are kept
   * for sampling.
   * Default is 0.95
   */
  topP: number
  /**
   * Specifies the seed to use during sampling. Note that, depending on
   * hardware, the same seed may lead to different results on two separate
   * machines.
   * Default is None
   */
  seed?: number
  /**
   * Use 16-bit floats for model memory key and value. Ignored when restoring
   * from the cache.
   * Default is false
   */
  float16: boolean
  /** Prompt for inference */
  prompt: string
  /**
   * A comma separated list of token biases. The list should be in the format
   * "TID=BIAS,TID=BIAS" where TID is an integer token ID and BIAS is a
   * floating point number.
   * For example, "1=-1.0,2=-1.0" sets the bias for token IDs 1
   * (start of document) and 2 (end of document) to -1.0 which effectively
   * disables the model from generating responses containing those token IDs.
   * Default is None
   */
  tokenBias?: Array<TokenBias>
  /**
   * Prevent the end of stream (EOS/EOD) token from being generated. This will allow the
   * model to generate text until it runs out of context space. Note: The --token-bias
   * option will override this if specified.
   * Default is false
   */
  ignoreEos: boolean
  /**
   * Feed prompt before inference, will hide feeded tokens in inference result
   * Default is false
   */
  feedPrompt: boolean
  /**
   * Only feed prompt, will not execute inference
   * When feed_prompt_only is true, feed_prompt will always be true
   * Default is false
   */
  feedPromptOnly: boolean
  /**
   * Load session path
   * Default is None
   */
  loadSession?: string
  /**
   * Persist session path
   * Default is None
   */
  saveSession?: string
}
export const enum ElementType {
  /** All tensors are stored as f32. */
  F32 = 0,
  /** All tensors are mostly stored as `f16`, except for the 1D tensors (32-bit). */
  MostlyF16 = 1,
  /** All tensors are mostly stored as `Q4_0`, except for the 1D tensors (32-bit). */
  MostlyQ4_0 = 2,
  /** All tensors are mostly stored as `Q4_1`, except for the 1D tensors (32-bit) */
  MostlyQ4_1 = 3,
  /**
   * All tensors are mostly stored as `Q4_1`, except for the 1D tensors (32-bit)
   * and the `tok_embeddings.weight` (f16) and `output.weight` tensors (f16).
   */
  MostlyQ4_1SomeF16 = 4,
  /** All tensors are mostly stored as `Q4_2`, except for the 1D tensors (32-bit). */
  MostlyQ4_2 = 5,
  /** All tensors are mostly stored as `Q8_0`, except for the 1D tensors (32-bit). */
  MostlyQ8_0 = 6,
  /** All tensors are mostly stored as `Q5_0`, except for the 1D tensors (32-bit). */
  MostlyQ5_0 = 7,
  /** All tensors are mostly stored as `Q5_1`, except for the 1D tensors (32-bit). */
  MostlyQ5_1 = 8
}
/** Not implemented yet. */
export function convert(path: string, elementType: ElementType): Promise<void>
export class LLama {
  /** Enable logger. */
  static enableLogger(): void
  /** Create a new LLama instance. */
  static create(config: ModelLoad): Promise<LLama>
  /** Get the tokenized result as number array, the result will be returned as Promise of number array. */
  tokenize(params: string): Promise<Array<number>>
  /** Get the embedding result as number array, the result will be returned as Promise of number array. */
  getWordEmbeddings(params: Partial<Generate>): Promise<Array<number>>
  /** Streaming the inference result as string, the result will be passed to the callback function. Will return a function to abort the inference. */
  inference(params: Partial<Generate>, callback: (result: InferenceResult) => void): () => void
}
