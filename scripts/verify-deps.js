const requiredDependencies = ["xlsx"];

const missing = requiredDependencies.filter((dep) => {
  try {
    require.resolve(dep);
    return false;
  } catch (error) {
    return true;
  }
});

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `Missing dependencies: ${missing.join(", ")}. Run \"npm install\" before \"npm run dev\".`
  );
  process.exit(1);
}
