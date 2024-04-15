import moment from "moment";

export function getTimeDelta(isoDateTime: string): string {
  const now = moment();

  const duration = moment.duration(now.diff(moment(isoDateTime)));
  const days = duration.asDays();
  const hours = duration.asHours();
  const minutes = duration.asMinutes();

  let timeDelta = "";
  if (days >= 1) {
    timeDelta = `${Math.floor(days)} days ago`;
  } else if (hours >= 1) {
    timeDelta = `${Math.floor(hours)} hours ago`;
  } else if (minutes >= 1) {
    timeDelta = `${Math.floor(minutes)} minutes ago`;
  } else {
    timeDelta = "just now";
  }

  return timeDelta;
}

export function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based in JavaScript
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
