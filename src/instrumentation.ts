export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { seedDefaultUsers } = await import("./server/auth/seed");
  await seedDefaultUsers();
}
