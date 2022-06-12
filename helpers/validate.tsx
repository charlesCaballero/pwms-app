//check if input value is a number and not empty
export const isInputNumber = (
  inputName: string,
  value: any,
  minLength: number = 1,
  maxLength: number = 8
) => {
  let result: any = { error: false, message: "" };
  if (!value.length) {
    result = {
      error: true,
      message: "You forgot to fill-in the " + inputName,
    };
  } else if (!/^[0-9]+$/.test(value)) {
    result = {
      error: true,
      message: inputName + " should only contain numbers.",
    };
  } else if (value.length > maxLength) {
    result = {
      error: true,
      message: inputName + " should not exceed " + maxLength + " digits.",
    };
  } else if (value.length < minLength) {
    result = {
      error: true,
      message: inputName + " needs to have atleast " + minLength + " digits.",
    };
  }

  return result;
};
// check if input is empty
export const isInputEmpty = (inputName: string, value: any) => {
  let result: any = { error: false, message: "" };

  if (!value.toString().length) {
    result = {
      error: true,
      message: "Please fill-in the " + inputName,
    };
  }
  return result;
};
// check if value is an email and not empty
export const isInputEmail = (value: any) => {
  let result: any = { error: false, message: "" };
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!value.length) {
    result = {
      error: true,
      message: "You forgot to fill-in the Email",
    };
  } else if (!value.match(mailformat)) {
    result = {
      error: true,
      message: "You have given an invalid email",
    };
  }
  return result;
};

export const isInputPassword = (value: any, minLength: number = 6) => {
  let result: any = { error: false, message: "" };
  if (!value.length) {
    result = {
      error: true,
      message: "You forgot to input your password",
    };
  } else if (value.length < minLength) {
    result = {
      error: true,
      message:
        "Your password needs to have atleast " + minLength + " chracters.",
    };
  }
  return result;
};
// check if all values are true
export const isAllTrue = (arr: boolean[]) => {
  return arr.every((element) => element === true);
};
