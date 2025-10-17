import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, "secreto_super_seguro", (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

export function soloAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
}
