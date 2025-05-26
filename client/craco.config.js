module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        (rule) =>
          !(
            rule.enforce === "pre" &&
            rule.use &&
            rule.use.some((u) =>
              typeof u === "string"
                ? u.includes("source-map-loader")
                : u.loader && u.loader.includes("source-map-loader")
            )
          )
      );

      return webpackConfig;
    },
  },
};
