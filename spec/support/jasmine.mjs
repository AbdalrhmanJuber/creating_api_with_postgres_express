export default {
  spec_dir: "src",
  spec_files: ["**/*[sS]pec.?(m)ts"],
  helpers:["/app/helpers/**/*.js"],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true,
  },
};
