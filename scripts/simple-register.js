console.log("Script starting...");

async function main() {
  console.log("Main function called");
  console.log("Environment variables:");
  console.log("NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS:", process.env.NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS);
}

main()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });