import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_CRYPT_SECRET_KEY;

// console.log(secretKey);

export const setLocalStorage = ({ id, profile_picture, name, role, jwt }) => {
  const data = JSON?.stringify({ id, profile_picture, name, role, jwt });

  //!It makes a cipher text which means the output of an encryption process.
  //!It is the text that results from applying an encryption algorithm to plain text (also known as clear text) along with a secret key.
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();

  localStorage.setItem("data", encryptedData);
};

export const getLocalStorage = () => {
  const encryptedData = localStorage?.getItem("data");
  if (encryptedData) {
    //!For decrypt
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    //!For turning value into redable format
    const decryptData = bytes.toString(CryptoJS.enc.Utf8);

    //!Convert into object and destruct the objects
    const { id, profile_picture, name, role, jwt } = JSON.parse(decryptData);

    return { id, profile_picture, name, role, jwt };
  }

  return null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
