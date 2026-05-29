export const decodeToken = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const decoded = decodeToken(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

export const getUserFromToken = (): { id: string; role: string; name: string } | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const decoded = decodeToken(token);
    return {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name
    };
  } catch {
    return null;
  }
};
