process.loadEnvFile();

/**
 * Middleware de autenticación de admins
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function isAdmin(req, res, next) {
  if (req.user.role != "admin") {
    return res
      .clearCookie("access_token", {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      })
      .status(403)
      .json({ success: false, message: "Acceso Denegado" });
  } else {
    return next();
  }
}
