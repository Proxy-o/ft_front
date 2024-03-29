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
