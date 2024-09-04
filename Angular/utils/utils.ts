import { ethers } from "ethers";
export function checkMobileView(id: string) {
  let myElement: any = document.getElementById(id);
  let bounding = myElement?.getBoundingClientRect();

  if (
    bounding &&
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <= window.innerWidth &&
    bounding.bottom <= window.innerHeight
  ) {
    return true;
  } else {
    return false;
  }
}

export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function getStorage(key: string): string | null {
  return localStorage.getItem(key);
}

export function setStorage(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key);
}

export function convertToUSNumber(rawNum: string): string {
  if (rawNum == "+" || !rawNum) return rawNum;
  rawNum = convertToRawNumber(rawNum);

  let hasCountryCode = rawNum.startsWith("+1");
  if (hasCountryCode) {
    const areaCodeStr = rawNum.slice(2, 5);
    const midSectionStr = rawNum.slice(5, 8);
    const lastSectionStr = rawNum.slice(8, 12);
    return `+1${areaCodeStr ? " (" + areaCodeStr : ""}${
      midSectionStr ? ") " + midSectionStr : ""
    }${lastSectionStr ? "-" + lastSectionStr : ""}`;
  } else {
    rawNum = rawNum.replace(/[+]/g, "");
    const areaCodeStr = rawNum.slice(0, 3);
    const midSectionStr = rawNum.slice(3, 6);
    const lastSectionStr = rawNum.slice(6, 12);
    return `+1${areaCodeStr ? " (" + areaCodeStr : ""}${
      midSectionStr ? ") " + midSectionStr : ""
    }${lastSectionStr ? "-" + lastSectionStr : ""}`;
  }
}

export function convertToRawNumber(usNum: string): string {
  let startsWith: boolean = usNum.startsWith("+");
  let rawNum: string = usNum
    .replace(/-/g, "")
    .replace("(", "")
    .replace(")", "")
    .replace(".", "")
    .replace(/ /g, "")
    .replace(/[^0-9]/g, "")
    .trim();
  return startsWith ? "+" + rawNum : rawNum;
}

export function setFooterHeight(): void {
  const wrapperComponent: any = document.getElementsByClassName("wrapper")[0];
  const footerHeight: number =
    document.getElementsByClassName("footer")[0].clientHeight;
  wrapperComponent.style.paddingBottom = `${footerHeight}px`;
}

export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function launchDateIsInFuture(dropDate: string): boolean {
  let launchDateWithTimeOffset = new Date(dropDate);
  let _launchDate = new Date(launchDateWithTimeOffset.getTime());
  return _launchDate > new Date();
}

export function convertToPlain(html: string) {
  // Create a new div element
  var tempDivElement = document.createElement("div");
  // Set the HTML content with the given value
  tempDivElement.innerHTML = html;
  // Retrieve the text property of the element
  return tempDivElement.textContent || tempDivElement.innerText || "";
}

export async function getGasPrice(provider: any, mul: number) {
  const price = await provider.getGasPrice();
  const str = ethers.utils.formatEther(price);
  const eth = +str * mul;
  return ethers.utils.parseEther(eth.toFixed(18));
}

export function findExtention(key: string) {
  let keysArray = key.split(".");
  let last = keysArray[keysArray.length - 1];
  return "." + last;
}

export function getDummyProfileImage(publicAddress: string) {
  var num = Number(publicAddress.replace(/[^0-9]/g, "")) % 50;
  return `assets/images/profile_${num}.png`;
}
