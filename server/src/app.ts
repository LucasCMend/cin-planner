import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError, NotFoundError, ValidationError } from './errors/index.js';
import courseRoutes from './routes/courseRoutes.js';
import majorRoutes from './routes/majorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import majorCourseRoutes from './routes/majorCourseRoutes.js';
import coursePrerequisiteRoutes from './routes/coursePrerequisiteRoutes.js';
import userCourseRoutes from './routes/userCourseRoutes.js';
import termRoutes from './routes/termRoutes.js'

const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError('Rota', { method: req.method, path: req.originalUrl }));
};

// Express identifies error handlers by their 4 parameters, so `_next` must stay.
const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  const appError = err instanceof ZodError ? new ValidationError(undefined, err.issues) : err;

  if (appError instanceof AppError) {
    res.status(appError.statusCode).json({
      error: { code: appError.code, message: appError.message, details: appError.details },
    });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } });
};

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/courses", courseRoutes)
app.use('/majors', majorRoutes);
app.use('/users', userRoutes);
app.use('/major-courses', majorCourseRoutes);
app.use('/course-prerequisites', coursePrerequisiteRoutes);
app.use('/user-courses', userCourseRoutes);
app.use('/terms', termRoutes)


app.use(notFoundHandler);
app.use(errorHandler);
