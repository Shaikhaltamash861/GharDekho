// src/middlewares/errorHandler.ts
const express = require("express");
export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = status === 500 ? "Something went wrong" : err.message;
  res.status(status).json({ code, message, details: err.details ?? null });
};
