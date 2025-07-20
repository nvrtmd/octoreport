const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;

Intl.DateTimeFormat.prototype.resolvedOptions = function () {
  const options = originalResolvedOptions.call(this);
  return {
    ...options,
    timeZone: 'Asia/Seoul',
  };
};
