/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as account from "../account.js";
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as documents from "../documents.js";
import type * as email from "../email.js";
import type * as http from "../http.js";
import type * as lib_gemini from "../lib/gemini.js";
import type * as lib_prompts from "../lib/prompts.js";
import type * as lib_sequencing from "../lib/sequencing.js";
import type * as lib_trades from "../lib/trades.js";
import type * as lib_validation from "../lib/validation.js";
import type * as photos from "../photos.js";
import type * as projects from "../projects.js";
import type * as scopes from "../scopes.js";
import type * as stripe from "../stripe.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  account: typeof account;
  ai: typeof ai;
  auth: typeof auth;
  documents: typeof documents;
  email: typeof email;
  http: typeof http;
  "lib/gemini": typeof lib_gemini;
  "lib/prompts": typeof lib_prompts;
  "lib/sequencing": typeof lib_sequencing;
  "lib/trades": typeof lib_trades;
  "lib/validation": typeof lib_validation;
  photos: typeof photos;
  projects: typeof projects;
  scopes: typeof scopes;
  stripe: typeof stripe;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
