export default function getErrorMessage(error: any) {
  const errors = error.response?.data?.errors ?? {};
  const message = Object.entries(errors)
    .map(([_, err]) => String(err))
    .join(", ");
  return message;
}
