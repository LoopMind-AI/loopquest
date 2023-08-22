export function statusBadge(status: string) {
  switch (status) {
    case "running":
      return "badge-info";
    case "finished":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "failed":
      return "badge-error";
    default:
      return "badge-info";
  }
}
