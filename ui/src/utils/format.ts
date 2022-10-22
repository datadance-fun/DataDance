import * as dayjs from "dayjs";

export const formatTime = (t: string | number, fmt = "YYYY-MM-DD") => {
  return dayjs(t).format(fmt);
};
