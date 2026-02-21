import { createDefaultInterviewers, getAllInterviewers } from "@/actions/interviewers";

async function main() {
  const existing = await getAllInterviewers();
  if (existing.length > 0) {
    console.log("Interviewers already seeded. Skipping.");
    return;
  }
  await createDefaultInterviewers();
  console.log("Seeded Lisa & Bob successfully.");
}

main().catch(console.error);
