/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface InferenceToken {
  token: string
  completed: boolean
}
export const enum InferenceResultType {
  Error = 'Error',
  Data = 'Data',
  End = 'End'
}
export interface InferenceResult {
  type: InferenceResultType
  data?: InferenceToken
  message?: string
}
export interface LlamaInvocation {
  nThreads: number
  nTokPredict: number
  topK: number
  topP?: number
  tfsZ?: number
  temp?: number
  typicalP?: number
  repeatPenalty?: number
  repeatLastN?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequence?: string
  penalizeNl?: boolean
  prompt: string
}
export interface LlamaContextParams {
  nCtx: number
  nParts: number
  seed: number
  f16Kv: boolean
  logitsAll: boolean
  vocabOnly: boolean
  useMlock: boolean
  embedding: boolean
  useMmap: boolean
}
export class LLama {
  static load(path: string, params: LlamaContextParams | undefined | null, enableLogger: boolean): Promise<LLama>
  getWordEmbedding(params: LlamaInvocation): Promise<Array<number>>
  tokenize(params: string, nCtx: number): Promise<Array<number>>
  inference(params: LlamaInvocation, callback: (result: InferenceResult) => void): () => void
}
