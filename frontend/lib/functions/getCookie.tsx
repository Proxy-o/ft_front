export default function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }
  let cookieArr = document.cookie.split("; ");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0]) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

export function checkCookie(name: string) {
  return new Promise((resolve, reject) => {
    let cookie = getCookie(name);
    if (cookie) {
      resolve(cookie);
    } else {
      setTimeout(() => {
        checkCookie(name).then(resolve).catch(reject);
      }, 100); // Check every 100ms
    }
  });
}

export const setCookie = (name: string, value: string, days: number = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Default 30 days
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/`;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};
