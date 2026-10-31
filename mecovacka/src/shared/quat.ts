// Malá knihovna kvaternionů pro telefon (bez three.js, ať je ovladač malý).
// Kvaternion je [x, y, z, w].

export type Q = [number, number, number, number];

const D2R = Math.PI / 180;

export function qmul(a: Q, b: Q): Q {
  const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

export function qaxis(x: number, y: number, z: number, angle: number): Q {
  const s = Math.sin(angle / 2);
  return [x * s, y * s, z * s, Math.cos(angle / 2)];
}

export function qnorm(q: Q): Q {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}

/**
 * Natočení z `deviceorientation` (alfa, beta, gama ve stupních) podle W3C:
 * R = Rz(alfa) · Rx(beta) · Ry(gama), ze souřadnic telefonu do zemských (Z nahoru).
 */
export function qFromDeviceOrientation(alpha: number, beta: number, gamma: number): Q {
  const qz = qaxis(0, 0, 1, alpha * D2R);
  const qx = qaxis(1, 0, 0, beta * D2R);
  const qy = qaxis(0, 1, 0, gamma * D2R);
  return qnorm(qmul(qmul(qz, qx), qy));
}

/** Otočí vektor kvaternionem. */
export function qrot(q: Q, v: [number, number, number]): [number, number, number] {
  const [x, y, z, w] = q;
  const [vx, vy, vz] = v;
  const tx = 2 * (y * vz - z * vy), ty = 2 * (z * vx - x * vz), tz = 2 * (x * vy - y * vx);
  return [vx + w * tx + (y * tz - z * ty), vy + w * ty + (z * tx - x * tz), vz + w * tz + (x * ty - y * tx)];
}

/** Úhel mezi dvěma natočeními (rad). */
export function qangle(a: Q, b: Q): number {
  const d = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);
  return 2 * Math.acos(Math.min(1, d));
}
