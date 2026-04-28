import { NextFunction, Request, Response } from "express";
import {
  CreatePostBody,
  GetPostsQuery,
  PatchPostBody,
  UpdatePostBody,
} from "../types/posts.types";

const hasOwnProperty = <T extends object>(
  value: T,
  key: PropertyKey,
): key is keyof T => Object.keys(value).includes(String(key));

const isNullableInteger = (value: unknown): value is number | null => {
  if (value === null) {
    return true;
  }
  return typeof value === "number" && Number.isInteger(value) && value > 0;
};

const isNullableString = (value: unknown): value is string | null => {
  return value === null || typeof value === "string";
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const isPositiveInteger = (value: number): boolean => {
  return Number.isInteger(value) && value > 0;
};

const parsePositiveIntegerQuery = (
  value: unknown,
  fallbackValue: number,
  fieldName: string,
): number => {
  if (value === undefined) {
    return fallbackValue;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  const parsedValue = Number(value);
  if (!isPositiveInteger(parsedValue)) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return parsedValue;
};

const parseOptionalStringQuery = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new TypeError("category and keyword must be strings");
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

type PatchFieldNormalizer = (
  value: unknown,
  key: keyof UpdatePostBody,
) => UpdatePostBody[keyof UpdatePostBody];

const normalizeNonEmptyStringField: PatchFieldNormalizer = (value, key) => {
  if (!isNonEmptyString(value)) {
    throw new Error(`${String(key)} must be a non-empty string`);
  }
  return value.trim();
};

const normalizeNullableIntegerField: PatchFieldNormalizer = (value, key) => {
  if (!isNullableInteger(value)) {
    throw new Error(`${String(key)} must be a positive integer or null`);
  }
  return value;
};

const normalizeDescriptionField: PatchFieldNormalizer = (value) => {
  if (!isNullableString(value)) {
    throw new Error("description must be a string or null");
  }
  if (typeof value === "string" && value.trim().length === 0) {
    throw new Error("description cannot be an empty string");
  }
  return typeof value === "string" ? value.trim() : value;
};

const patchFieldNormalizers: Record<
  keyof UpdatePostBody,
  PatchFieldNormalizer
> = {
  title: normalizeNonEmptyStringField,
  content: normalizeNonEmptyStringField,
  image: normalizeNonEmptyStringField,
  categoryId: normalizeNullableIntegerField,
  statusId: normalizeNullableIntegerField,
  description: normalizeDescriptionField,
};

const normalizePatchField = (
  key: string,
  value: unknown,
): {
  key: keyof UpdatePostBody;
  value: UpdatePostBody[keyof UpdatePostBody];
} => {
  const normalizer = patchFieldNormalizers[key as keyof UpdatePostBody];
  if (!normalizer) {
    throw new Error(`Unknown field: ${key}`);
  }

  const typedKey = key as keyof UpdatePostBody;
  return { key: typedKey, value: normalizer(value, typedKey) };
};

const PostMiddleware = {
  validateGetPostsQuery: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parsePositiveIntegerQuery(_req.query.page, 1, "page");
      const limit = parsePositiveIntegerQuery(_req.query.limit, 6, "limit");
      const category = parseOptionalStringQuery(_req.query.category);
      const keyword = parseOptionalStringQuery(_req.query.keyword);

      const normalizedQuery: GetPostsQuery = {
        page,
        limit,
        ...(category ? { category } : {}),
        ...(keyword ? { keyword } : {}),
      };

      res.locals.getPostsQuery = normalizedQuery;
      next();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid query parameters";
      return res.status(400).json({ message });
    }
  },
  validatePostId: (req: Request, res: Response, next: NextFunction) => {
    const idParam = req.params.id ?? req.params.postId;
    if (!idParam) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const postId = Number(idParam);
    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Post ID must be a number" });
    }
    if (postId <= 0) {
      return res
        .status(400)
        .json({ message: "Post ID must be greater than 0" });
    }
    res.locals.postId = postId;
    next();
  },
  validatePostData: (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ message: "Request body must be an object" });
    }

    const requiredKeys: Array<keyof UpdatePostBody> = [
      "title",
      "content",
      "image",
      "categoryId",
      "statusId",
      "description",
    ];

    for (const key of requiredKeys) {
      if (!hasOwnProperty(req.body as object, key)) {
        return res.status(400).json({ message: `${key} is required` });
      }
    }

    const { title, content, image, categoryId, statusId, description } =
      req.body as Record<string, unknown>;

    if (
      !isNonEmptyString(title) ||
      !isNonEmptyString(content) ||
      !isNonEmptyString(image)
    ) {
      return res.status(400).json({
        message: "title, content, and image must be non-empty strings",
      });
    }

    if (!isNullableInteger(categoryId) || !isNullableInteger(statusId)) {
      return res.status(400).json({
        message: "categoryId and statusId must be positive integers or null",
      });
    }

    if (!isNullableString(description)) {
      return res
        .status(400)
        .json({ message: "description must be a string or null" });
    }

    if (typeof description === "string" && description.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "description cannot be an empty string" });
    }

    const normalizedBody: UpdatePostBody = {
      title: title.trim(),
      content: content.trim(),
      image: image.trim(),
      categoryId,
      statusId,
      description:
        typeof description === "string" ? description.trim() : description,
    };

    res.locals.postData = normalizedBody;
    next();
  },
  validatePatchPostData: (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ message: "Request body must be an object" });
    }

    const allowedKeys: Array<keyof UpdatePostBody> = [
      "title",
      "content",
      "image",
      "categoryId",
      "statusId",
      "description",
    ];

    const entries = Object.entries(req.body as Record<string, unknown>);
    if (entries.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one field is required for patch update" });
    }

    const normalizedBody: PatchPostBody = {};

    try {
      for (const [key, value] of entries) {
        if (!(allowedKeys as string[]).includes(key)) {
          throw new Error(`Unknown field: ${key}`);
        }

        const normalized = normalizePatchField(key, value);
        Object.assign(normalizedBody, { [normalized.key]: normalized.value });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid patch payload";
      return res.status(400).json({ message });
    }

    res.locals.patchPostData = normalizedBody;
    next();
  },

  validateCreatePostData: (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ message: "Request body must be an object" });
    }
    const requiredKeys: Array<keyof CreatePostBody> = [
      "title",
      "image",
      "categoryId",
      "description",
      "content",
      "statusId",
    ];
    for (const key of requiredKeys) {
      if (!hasOwnProperty(req.body as object, key)) {
        return res.status(400).json({ message: `${key} is required` });
      }
    }
    const { title, image, categoryId, description, content, statusId } =
      req.body as Record<string, unknown>;
    if (
      !isNonEmptyString(title) ||
      !isNonEmptyString(content) ||
      !isNonEmptyString(image) ||
      !isNonEmptyString(description)
    ) {
      return res.status(400).json({
        message:
          "title, content, image, and description must be non-empty strings",
      });
    }

    if (!isNullableInteger(statusId)) {
      return res
        .status(400)
        .json({ message: "statusId must be a positive integer" });
    }

    const isValidCategoryId =
      categoryId === null ||
      (typeof categoryId === "number" &&
        Number.isInteger(categoryId) &&
        categoryId >= 0) ||
      (typeof categoryId === "string" &&
        categoryId.trim() !== "" &&
        Number.isInteger(Number(categoryId)) &&
        Number(categoryId) >= 0);
    if (!isValidCategoryId) {
      return res
        .status(400)
        .json({ message: "categoryId must be a positive integer or string" });
    }
    const normalizedBody: CreatePostBody = {
      title: title.trim(),
      image: image.trim(),
      categoryId: isPositiveInteger(Number(categoryId))
        ? Number(categoryId)
        : String(categoryId),
      description: description.trim(),
      content: content.trim(),
      statusId: Number(statusId),
    };
    res.locals.createPostData = normalizedBody;
    next();
  },
};

export { PostMiddleware };
