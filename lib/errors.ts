export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 500
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} no encontrado`, 404)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("UNAUTHORIZED", "No autorizado", 401)
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super("FORBIDDEN", "Acceso denegado", 403)
  }
}
